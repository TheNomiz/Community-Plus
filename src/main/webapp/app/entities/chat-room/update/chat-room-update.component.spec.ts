import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChatRoomFormService } from './chat-room-form.service';
import { ChatRoomService } from '../service/chat-room.service';
import { IChatRoom } from '../chat-room.model';

import { ChatRoomUpdateComponent } from './chat-room-update.component';

describe('ChatRoom Management Update Component', () => {
  let comp: ChatRoomUpdateComponent;
  let fixture: ComponentFixture<ChatRoomUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chatRoomFormService: ChatRoomFormService;
  let chatRoomService: ChatRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChatRoomUpdateComponent],
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
      .overrideTemplate(ChatRoomUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChatRoomUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chatRoomFormService = TestBed.inject(ChatRoomFormService);
    chatRoomService = TestBed.inject(ChatRoomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const chatRoom: IChatRoom = { id: 456 };

      activatedRoute.data = of({ chatRoom });
      comp.ngOnInit();

      expect(comp.chatRoom).toEqual(chatRoom);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatRoom>>();
      const chatRoom = { id: 123 };
      jest.spyOn(chatRoomFormService, 'getChatRoom').mockReturnValue(chatRoom);
      jest.spyOn(chatRoomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatRoom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chatRoom }));
      saveSubject.complete();

      // THEN
      expect(chatRoomFormService.getChatRoom).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(chatRoomService.update).toHaveBeenCalledWith(expect.objectContaining(chatRoom));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatRoom>>();
      const chatRoom = { id: 123 };
      jest.spyOn(chatRoomFormService, 'getChatRoom').mockReturnValue({ id: null });
      jest.spyOn(chatRoomService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatRoom: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chatRoom }));
      saveSubject.complete();

      // THEN
      expect(chatRoomFormService.getChatRoom).toHaveBeenCalled();
      expect(chatRoomService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChatRoom>>();
      const chatRoom = { id: 123 };
      jest.spyOn(chatRoomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chatRoom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chatRoomService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
