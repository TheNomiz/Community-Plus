import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmergencyGuideFormService } from './emergency-guide-form.service';
import { EmergencyGuideService } from '../service/emergency-guide.service';
import { IEmergencyGuide } from '../emergency-guide.model';

import { EmergencyGuideUpdateComponent } from './emergency-guide-update.component';

describe('EmergencyGuide Management Update Component', () => {
  let comp: EmergencyGuideUpdateComponent;
  let fixture: ComponentFixture<EmergencyGuideUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let emergencyGuideFormService: EmergencyGuideFormService;
  let emergencyGuideService: EmergencyGuideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmergencyGuideUpdateComponent],
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
      .overrideTemplate(EmergencyGuideUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmergencyGuideUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emergencyGuideFormService = TestBed.inject(EmergencyGuideFormService);
    emergencyGuideService = TestBed.inject(EmergencyGuideService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const emergencyGuide: IEmergencyGuide = { id: 456 };

      activatedRoute.data = of({ emergencyGuide });
      comp.ngOnInit();

      expect(comp.emergencyGuide).toEqual(emergencyGuide);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyGuide>>();
      const emergencyGuide = { id: 123 };
      jest.spyOn(emergencyGuideFormService, 'getEmergencyGuide').mockReturnValue(emergencyGuide);
      jest.spyOn(emergencyGuideService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyGuide });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emergencyGuide }));
      saveSubject.complete();

      // THEN
      expect(emergencyGuideFormService.getEmergencyGuide).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(emergencyGuideService.update).toHaveBeenCalledWith(expect.objectContaining(emergencyGuide));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyGuide>>();
      const emergencyGuide = { id: 123 };
      jest.spyOn(emergencyGuideFormService, 'getEmergencyGuide').mockReturnValue({ id: null });
      jest.spyOn(emergencyGuideService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyGuide: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emergencyGuide }));
      saveSubject.complete();

      // THEN
      expect(emergencyGuideFormService.getEmergencyGuide).toHaveBeenCalled();
      expect(emergencyGuideService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyGuide>>();
      const emergencyGuide = { id: 123 };
      jest.spyOn(emergencyGuideService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyGuide });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emergencyGuideService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
