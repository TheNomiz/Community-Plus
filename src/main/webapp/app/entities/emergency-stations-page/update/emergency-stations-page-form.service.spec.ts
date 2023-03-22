import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../emergency-stations-page.test-samples';

import { EmergencyStationsPageFormService } from './emergency-stations-page-form.service';

describe('EmergencyStationsPage Form Service', () => {
  let service: EmergencyStationsPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyStationsPageFormService);
  });

  describe('Service methods', () => {
    describe('createEmergencyStationsPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmergencyStationsPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            stationType: expect.any(Object),
            latitude: expect.any(Object),
            longitude: expect.any(Object),
          })
        );
      });

      it('passing IEmergencyStationsPage should create a new form with FormGroup', () => {
        const formGroup = service.createEmergencyStationsPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            stationType: expect.any(Object),
            latitude: expect.any(Object),
            longitude: expect.any(Object),
          })
        );
      });
    });

    describe('getEmergencyStationsPage', () => {
      it('should return NewEmergencyStationsPage for default EmergencyStationsPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEmergencyStationsPageFormGroup(sampleWithNewData);

        const emergencyStationsPage = service.getEmergencyStationsPage(formGroup) as any;

        expect(emergencyStationsPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmergencyStationsPage for empty EmergencyStationsPage initial value', () => {
        const formGroup = service.createEmergencyStationsPageFormGroup();

        const emergencyStationsPage = service.getEmergencyStationsPage(formGroup) as any;

        expect(emergencyStationsPage).toMatchObject({});
      });

      it('should return IEmergencyStationsPage', () => {
        const formGroup = service.createEmergencyStationsPageFormGroup(sampleWithRequiredData);

        const emergencyStationsPage = service.getEmergencyStationsPage(formGroup) as any;

        expect(emergencyStationsPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmergencyStationsPage should not enable id FormControl', () => {
        const formGroup = service.createEmergencyStationsPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmergencyStationsPage should disable id FormControl', () => {
        const formGroup = service.createEmergencyStationsPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
