import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmergencyStationsFormService } from './emergency-stations-form.service';
import { EmergencyStationsService } from '../service/emergency-stations.service';
import { IEmergencyStations } from '../emergency-stations.model';

import { EmergencyStationsUpdateComponent } from './emergency-stations-update.component';

describe('EmergencyStations Management Update Component', () => {
  let comp: EmergencyStationsUpdateComponent;
  let fixture: ComponentFixture<EmergencyStationsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let emergencyStationsFormService: EmergencyStationsFormService;
  let emergencyStationsService: EmergencyStationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmergencyStationsUpdateComponent],
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
      .overrideTemplate(EmergencyStationsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmergencyStationsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emergencyStationsFormService = TestBed.inject(EmergencyStationsFormService);
    emergencyStationsService = TestBed.inject(EmergencyStationsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const emergencyStations: IEmergencyStations = { id: 456 };

      activatedRoute.data = of({ emergencyStations });
      comp.ngOnInit();

      expect(comp.emergencyStations).toEqual(emergencyStations);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyStations>>();
      const emergencyStations = { id: 123 };
      jest.spyOn(emergencyStationsFormService, 'getEmergencyStations').mockReturnValue(emergencyStations);
      jest.spyOn(emergencyStationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyStations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emergencyStations }));
      saveSubject.complete();

      // THEN
      expect(emergencyStationsFormService.getEmergencyStations).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(emergencyStationsService.update).toHaveBeenCalledWith(expect.objectContaining(emergencyStations));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyStations>>();
      const emergencyStations = { id: 123 };
      jest.spyOn(emergencyStationsFormService, 'getEmergencyStations').mockReturnValue({ id: null });
      jest.spyOn(emergencyStationsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyStations: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emergencyStations }));
      saveSubject.complete();

      // THEN
      expect(emergencyStationsFormService.getEmergencyStations).toHaveBeenCalled();
      expect(emergencyStationsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmergencyStations>>();
      const emergencyStations = { id: 123 };
      jest.spyOn(emergencyStationsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emergencyStations });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emergencyStationsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
