import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BusinessFormService } from './business-form.service';
import { BusinessService } from '../service/business.service';
import { IBusiness } from '../business.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { ChatRoomService } from 'app/entities/chat-room/service/chat-room.service';

import { BusinessUpdateComponent } from './business-update.component';

describe('Business Management Update Component', () => {
  let comp: BusinessUpdateComponent;
  let fixture: ComponentFixture<BusinessUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let businessFormService: BusinessFormService;
  let businessService: BusinessService;
  let userProfileService: UserProfileService;
  let chatRoomService: ChatRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BusinessUpdateComponent],
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
      .overrideTemplate(BusinessUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    businessFormService = TestBed.inject(BusinessFormService);
    businessService = TestBed.inject(BusinessService);
    userProfileService = TestBed.inject(UserProfileService);
    chatRoomService = TestBed.inject(ChatRoomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const business: IBusiness = { id: 456 };
      const postedby: IUserProfile = { id: 68412 };
      business.postedby = postedby;

      const userProfileCollection: IUserProfile[] = [{ id: 35010 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [postedby];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ business });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ChatRoom query and add missing value', () => {
      const business: IBusiness = { id: 456 };
      const businessrooms: IChatRoom[] = [{ id: 61243 }];
      business.businessrooms = businessrooms;

      const chatRoomCollection: IChatRoom[] = [{ id: 31503 }];
      jest.spyOn(chatRoomService, 'query').mockReturnValue(of(new HttpResponse({ body: chatRoomCollection })));
      const additionalChatRooms = [...businessrooms];
      const expectedCollection: IChatRoom[] = [...additionalChatRooms, ...chatRoomCollection];
      jest.spyOn(chatRoomService, 'addChatRoomToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ business });
      comp.ngOnInit();

      expect(chatRoomService.query).toHaveBeenCalled();
      expect(chatRoomService.addChatRoomToCollectionIfMissing).toHaveBeenCalledWith(
        chatRoomCollection,
        ...additionalChatRooms.map(expect.objectContaining)
      );
      expect(comp.chatRoomsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const business: IBusiness = { id: 456 };
      const postedby: IUserProfile = { id: 82048 };
      business.postedby = postedby;
      const businessroom: IChatRoom = { id: 19850 };
      business.businessrooms = [businessroom];

      activatedRoute.data = of({ business });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(postedby);
      expect(comp.chatRoomsSharedCollection).toContain(businessroom);
      expect(comp.business).toEqual(business);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusiness>>();
      const business = { id: 123 };
      jest.spyOn(businessFormService, 'getBusiness').mockReturnValue(business);
      jest.spyOn(businessService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ business });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: business }));
      saveSubject.complete();

      // THEN
      expect(businessFormService.getBusiness).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(businessService.update).toHaveBeenCalledWith(expect.objectContaining(business));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusiness>>();
      const business = { id: 123 };
      jest.spyOn(businessFormService, 'getBusiness').mockReturnValue({ id: null });
      jest.spyOn(businessService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ business: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: business }));
      saveSubject.complete();

      // THEN
      expect(businessFormService.getBusiness).toHaveBeenCalled();
      expect(businessService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBusiness>>();
      const business = { id: 123 };
      jest.spyOn(businessService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ business });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(businessService.update).toHaveBeenCalled();
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
