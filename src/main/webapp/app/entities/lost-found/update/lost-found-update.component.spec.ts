import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LostFoundFormService } from './lost-found-form.service';
import { LostFoundService } from '../service/lost-found.service';
import { ILostFound } from '../lost-found.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { ChatRoomService } from 'app/entities/chat-room/service/chat-room.service';

import { LostFoundUpdateComponent } from './lost-found-update.component';

describe('LostFound Management Update Component', () => {
  let comp: LostFoundUpdateComponent;
  let fixture: ComponentFixture<LostFoundUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lostFoundFormService: LostFoundFormService;
  let lostFoundService: LostFoundService;
  let userProfileService: UserProfileService;
  let chatRoomService: ChatRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LostFoundUpdateComponent],
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
      .overrideTemplate(LostFoundUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LostFoundUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lostFoundFormService = TestBed.inject(LostFoundFormService);
    lostFoundService = TestBed.inject(LostFoundService);
    userProfileService = TestBed.inject(UserProfileService);
    chatRoomService = TestBed.inject(ChatRoomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const lostFound: ILostFound = { id: 456 };
      const postedby: IUserProfile = { id: 82054 };
      lostFound.postedby = postedby;

      const userProfileCollection: IUserProfile[] = [{ id: 43421 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [postedby];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lostFound });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ChatRoom query and add missing value', () => {
      const lostFound: ILostFound = { id: 456 };
      const lostItems: IChatRoom[] = [{ id: 64 }];
      lostFound.lostItems = lostItems;

      const chatRoomCollection: IChatRoom[] = [{ id: 84604 }];
      jest.spyOn(chatRoomService, 'query').mockReturnValue(of(new HttpResponse({ body: chatRoomCollection })));
      const additionalChatRooms = [...lostItems];
      const expectedCollection: IChatRoom[] = [...additionalChatRooms, ...chatRoomCollection];
      jest.spyOn(chatRoomService, 'addChatRoomToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lostFound });
      comp.ngOnInit();

      expect(chatRoomService.query).toHaveBeenCalled();
      expect(chatRoomService.addChatRoomToCollectionIfMissing).toHaveBeenCalledWith(
        chatRoomCollection,
        ...additionalChatRooms.map(expect.objectContaining)
      );
      expect(comp.chatRoomsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const lostFound: ILostFound = { id: 456 };
      const postedby: IUserProfile = { id: 65550 };
      lostFound.postedby = postedby;
      const lostItem: IChatRoom = { id: 32253 };
      lostFound.lostItems = [lostItem];

      activatedRoute.data = of({ lostFound });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(postedby);
      expect(comp.chatRoomsSharedCollection).toContain(lostItem);
      expect(comp.lostFound).toEqual(lostFound);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILostFound>>();
      const lostFound = { id: 123 };
      jest.spyOn(lostFoundFormService, 'getLostFound').mockReturnValue(lostFound);
      jest.spyOn(lostFoundService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lostFound });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lostFound }));
      saveSubject.complete();

      // THEN
      expect(lostFoundFormService.getLostFound).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(lostFoundService.update).toHaveBeenCalledWith(expect.objectContaining(lostFound));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILostFound>>();
      const lostFound = { id: 123 };
      jest.spyOn(lostFoundFormService, 'getLostFound').mockReturnValue({ id: null });
      jest.spyOn(lostFoundService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lostFound: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lostFound }));
      saveSubject.complete();

      // THEN
      expect(lostFoundFormService.getLostFound).toHaveBeenCalled();
      expect(lostFoundService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILostFound>>();
      const lostFound = { id: 123 };
      jest.spyOn(lostFoundService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lostFound });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lostFoundService.update).toHaveBeenCalled();
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
