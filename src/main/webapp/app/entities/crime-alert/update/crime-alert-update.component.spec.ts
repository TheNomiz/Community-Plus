import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CrimeAlertFormService } from './crime-alert-form.service';
import { CrimeAlertService } from '../service/crime-alert.service';
import { ICrimeAlert } from '../crime-alert.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { CrimeAlertUpdateComponent } from './crime-alert-update.component';

describe('CrimeAlert Management Update Component', () => {
  let comp: CrimeAlertUpdateComponent;
  let fixture: ComponentFixture<CrimeAlertUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let crimeAlertFormService: CrimeAlertFormService;
  let crimeAlertService: CrimeAlertService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CrimeAlertUpdateComponent],
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
      .overrideTemplate(CrimeAlertUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CrimeAlertUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    crimeAlertFormService = TestBed.inject(CrimeAlertFormService);
    crimeAlertService = TestBed.inject(CrimeAlertService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const crimeAlert: ICrimeAlert = { id: 456 };
      const postedby: IUser = { id: 4198 };
      crimeAlert.postedby = postedby;

      const userCollection: IUser[] = [{ id: 92048 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [postedby];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ crimeAlert });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const crimeAlert: ICrimeAlert = { id: 456 };
      const postedby: IUser = { id: 45094 };
      crimeAlert.postedby = postedby;

      activatedRoute.data = of({ crimeAlert });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(postedby);
      expect(comp.crimeAlert).toEqual(crimeAlert);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICrimeAlert>>();
      const crimeAlert = { id: 123 };
      jest.spyOn(crimeAlertFormService, 'getCrimeAlert').mockReturnValue(crimeAlert);
      jest.spyOn(crimeAlertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ crimeAlert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: crimeAlert }));
      saveSubject.complete();

      // THEN
      expect(crimeAlertFormService.getCrimeAlert).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(crimeAlertService.update).toHaveBeenCalledWith(expect.objectContaining(crimeAlert));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICrimeAlert>>();
      const crimeAlert = { id: 123 };
      jest.spyOn(crimeAlertFormService, 'getCrimeAlert').mockReturnValue({ id: null });
      jest.spyOn(crimeAlertService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ crimeAlert: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: crimeAlert }));
      saveSubject.complete();

      // THEN
      expect(crimeAlertFormService.getCrimeAlert).toHaveBeenCalled();
      expect(crimeAlertService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICrimeAlert>>();
      const crimeAlert = { id: 123 };
      jest.spyOn(crimeAlertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ crimeAlert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(crimeAlertService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
