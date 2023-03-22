import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EventFormService } from './event-form.service';
import { EventService } from '../service/event.service';
import { IEvent } from '../event.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { ChatRoomService } from 'app/entities/chat-room/service/chat-room.service';

import { EventUpdateComponent } from './event-update.component';

describe('Event Management Update Component', () => {
  let comp: EventUpdateComponent;
  let fixture: ComponentFixture<EventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventFormService: EventFormService;
  let eventService: EventService;
  let userProfileService: UserProfileService;
  let chatRoomService: ChatRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EventUpdateComponent],
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
      .overrideTemplate(EventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventFormService = TestBed.inject(EventFormService);
    eventService = TestBed.inject(EventService);
    userProfileService = TestBed.inject(UserProfileService);
    chatRoomService = TestBed.inject(ChatRoomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const postedby: IUserProfile = { id: 24421 };
      event.postedby = postedby;

      const userProfileCollection: IUserProfile[] = [{ id: 14460 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [postedby];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ChatRoom query and add missing value', () => {
      const event: IEvent = { id: 456 };
      const eventsrooms: IChatRoom[] = [{ id: 73364 }];
      event.eventsrooms = eventsrooms;

      const chatRoomCollection: IChatRoom[] = [{ id: 16541 }];
      jest.spyOn(chatRoomService, 'query').mockReturnValue(of(new HttpResponse({ body: chatRoomCollection })));
      const additionalChatRooms = [...eventsrooms];
      const expectedCollection: IChatRoom[] = [...additionalChatRooms, ...chatRoomCollection];
      jest.spyOn(chatRoomService, 'addChatRoomToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(chatRoomService.query).toHaveBeenCalled();
      expect(chatRoomService.addChatRoomToCollectionIfMissing).toHaveBeenCalledWith(
        chatRoomCollection,
        ...additionalChatRooms.map(expect.objectContaining)
      );
      expect(comp.chatRoomsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const event: IEvent = { id: 456 };
      const postedby: IUserProfile = { id: 39283 };
      event.postedby = postedby;
      const eventsroom: IChatRoom = { id: 30746 };
      event.eventsrooms = [eventsroom];

      activatedRoute.data = of({ event });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(postedby);
      expect(comp.chatRoomsSharedCollection).toContain(eventsroom);
      expect(comp.event).toEqual(event);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      const event = { id: 123 };
      jest.spyOn(eventFormService, 'getEvent').mockReturnValue(event);
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      // THEN
      expect(eventFormService.getEvent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventService.update).toHaveBeenCalledWith(expect.objectContaining(event));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      const event = { id: 123 };
      jest.spyOn(eventFormService, 'getEvent').mockReturnValue({ id: null });
      jest.spyOn(eventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: event }));
      saveSubject.complete();

      // THEN
      expect(eventFormService.getEvent).toHaveBeenCalled();
      expect(eventService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvent>>();
      const event = { id: 123 };
      jest.spyOn(eventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ event });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUserProfile', () => {
      it('Should forward to userProfileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userProfileService, 'compareUserProfile');
        comp.compareUserProfile(entity, entity2);
        expect(userProfileService.compareUserProfile).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
