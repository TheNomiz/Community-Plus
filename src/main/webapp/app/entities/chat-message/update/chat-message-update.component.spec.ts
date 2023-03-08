import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChatMessageFormService } from './chat-message-form.service';
import { ChatMessageService } from '../service/chat-message.service';
import { IChatMessage } from '../chat-message.model';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { ChatRoomService } from 'app/entities/chat-room/service/chat-room.service';

import { ChatMessageUpdateComponent } from './chat-message-update.component';

describe('ChatMessage Management Update Component', () => {
  let comp: ChatMessageUpdateComponent;
  let fixture: ComponentFixture<ChatMessageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chatMessageFormService: ChatMessageFormService;
  let chatMessageService: ChatMessageService;
  let chatRoomService: ChatRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChatMessageUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ChatMessageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChatMessageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chatMessageFormService = TestBed.inject(ChatMessageFormService);
    chatMessageService = TestBed.inject(ChatMessageService);
    chatRoomService = TestBed.inject(ChatRoomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ChatRoom query and add missing value', () => {
      const chatMessage: IChatMessage = { id: 456 };
      const room: IChatRoom = { id: 37307 };
      chatMessage.room = room;

      const chatRoomCollection: IChatRoom[] = [{ id: 3326 }];
      jest.spyOn(chatRoomService, 'query').mockReturnValue(of(new HttpResponse({ body: chatRoomCollection })));
      const additionalChatRooms = [room];
      const expectedCollection: IChatRoom[] = [...additionalChatRooms, ...chatRoomCollection];
      jest.spyOn(chatRoomService, 'addChatRoomToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      expect(chatRoomService.query).toHaveBeenCalled();
      expect(chatRoomService.addChatRoomToCollectionIfMissing).toHaveBeenCalledWith(
        chatRoomCollection,
        ...additionalChatRooms.map(expect.objectContaining)
      );
      expect(comp.chatRoomsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chatMessage: IChatMessage = { id: 456 };
      const room: IChatRoom = { id: 54454 };
      chatMessage.room = room;

      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      expect(comp.chatRoomsSharedCollection).toContain(room);
      expect(comp.chatMessage).toEqual(chatMessage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatMessage>>();
      const chatMessage = { id: 123 };
      jest.spyOn(chatMessageFormService, 'getChatMessage').mockReturnValue(chatMessage);
      jest.spyOn(chatMessageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chatMessage }));
      saveSubject.complete();

      // THEN
      expect(chatMessageFormService.getChatMessage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(chatMessageService.update).toHaveBeenCalledWith(expect.objectContaining(chatMessage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatMessage>>();
      const chatMessage = { id: 123 };
      jest.spyOn(chatMessageFormService, 'getChatMessage').mockReturnValue({ id: null });
      jest.spyOn(chatMessageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatMessage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chatMessage }));
      saveSubject.complete();

      // THEN
      expect(chatMessageFormService.getChatMessage).toHaveBeenCalled();
      expect(chatMessageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatMessage>>();
      const chatMessage = { id: 123 };
      jest.spyOn(chatMessageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatMessage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chatMessageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareChatRoom', () => {
      it('Should forward to chatRoomService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(chatRoomService, 'compareChatRoom');
        comp.compareChatRoom(entity, entity2);
        expect(chatRoomService.compareChatRoom).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
