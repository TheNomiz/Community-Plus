import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmergencyGuidePageFormService } from './emergency-guide-page-form.service';
import { EmergencyGuidePageService } from '../service/emergency-guide-page.service';
import { IEmergencyGuidePage } from '../emergency-guide-page.model';

import { EmergencyGuidePageUpdateComponent } from './emergency-guide-page-update.component';

describe('EmergencyGuidePage Management Update Component', () => {
  let comp: EmergencyGuidePageUpdateComponent;
  let fixture: ComponentFixture<EmergencyGuidePageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let emergencyGuidePageFormService: EmergencyGuidePageFormService;
  let emergencyGuidePageService: EmergencyGuidePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmergencyGuidePageUpdateComponent],
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
      .overrideTemplate(EmergencyGuidePageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmergencyGuidePageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emergencyGuidePageFormService = TestBed.inject(EmergencyGuidePageFormService);
    emergencyGuidePageService = TestBed.inject(EmergencyGuidePageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const emergencyGuidePage: IEmergencyGuidePage = { id: 456 };

      activatedRoute.data = of({ emergencyGuidePage });
      comp.ngOnInit();

      expect(comp.emergencyGuidePage).toEqual(emergencyGuidePage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyGuidePage>>();
      const emergencyGuidePage = { id: 123 };
      jest.spyOn(emergencyGuidePageFormService, 'getEmergencyGuidePage').mockReturnValue(emergencyGuidePage);
      jest.spyOn(emergencyGuidePageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyGuidePage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emergencyGuidePage }));
      saveSubject.complete();

      // THEN
      expect(emergencyGuidePageFormService.getEmergencyGuidePage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(emergencyGuidePageService.update).toHaveBeenCalledWith(expect.objectContaining(emergencyGuidePage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyGuidePage>>();
      const emergencyGuidePage = { id: 123 };
      jest.spyOn(emergencyGuidePageFormService, 'getEmergencyGuidePage').mockReturnValue({ id: null });
      jest.spyOn(emergencyGuidePageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyGuidePage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emergencyGuidePage }));
      saveSubject.complete();

      // THEN
      expect(emergencyGuidePageFormService.getEmergencyGuidePage).toHaveBeenCalled();
      expect(emergencyGuidePageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyGuidePage>>();
      const emergencyGuidePage = { id: 123 };
      jest.spyOn(emergencyGuidePageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyGuidePage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emergencyGuidePageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
