import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmergencyStationsPageFormService } from './emergency-stations-page-form.service';
import { EmergencyStationsPageService } from '../service/emergency-stations-page.service';
import { IEmergencyStationsPage } from '../emergency-stations-page.model';

import { EmergencyStationsPageUpdateComponent } from './emergency-stations-page-update.component';

describe('EmergencyStationsPage Management Update Component', () => {
  let comp: EmergencyStationsPageUpdateComponent;
  let fixture: ComponentFixture<EmergencyStationsPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let emergencyStationsPageFormService: EmergencyStationsPageFormService;
  let emergencyStationsPageService: EmergencyStationsPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmergencyStationsPageUpdateComponent],
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
      .overrideTemplate(EmergencyStationsPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmergencyStationsPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emergencyStationsPageFormService = TestBed.inject(EmergencyStationsPageFormService);
    emergencyStationsPageService = TestBed.inject(EmergencyStationsPageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const emergencyStationsPage: IEmergencyStationsPage = { id: 456 };

      activatedRoute.data = of({ emergencyStationsPage });
      comp.ngOnInit();

      expect(comp.emergencyStationsPage).toEqual(emergencyStationsPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyStationsPage>>();
      const emergencyStationsPage = { id: 123 };
      jest.spyOn(emergencyStationsPageFormService, 'getEmergencyStationsPage').mockReturnValue(emergencyStationsPage);
      jest.spyOn(emergencyStationsPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyStationsPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emergencyStationsPage }));
      saveSubject.complete();

      // THEN
      expect(emergencyStationsPageFormService.getEmergencyStationsPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(emergencyStationsPageService.update).toHaveBeenCalledWith(expect.objectContaining(emergencyStationsPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyStationsPage>>();
      const emergencyStationsPage = { id: 123 };
      jest.spyOn(emergencyStationsPageFormService, 'getEmergencyStationsPage').mockReturnValue({ id: null });
      jest.spyOn(emergencyStationsPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyStationsPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emergencyStationsPage }));
      saveSubject.complete();

      // THEN
      expect(emergencyStationsPageFormService.getEmergencyStationsPage).toHaveBeenCalled();
      expect(emergencyStationsPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyStationsPage>>();
      const emergencyStationsPage = { id: 123 };
      jest.spyOn(emergencyStationsPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyStationsPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emergencyStationsPageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
