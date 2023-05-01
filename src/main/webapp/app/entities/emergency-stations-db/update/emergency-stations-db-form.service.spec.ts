import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../emergency-stations-db.test-samples';

import { EmergencyStationsDbFormService } from './emergency-stations-db-form.service';

describe('EmergencyStations Form Service', () => {
  let service: EmergencyStationsDbFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyStationsDbFormService);
  });

  describe('Service methods', () => {
    describe('createEmergencyStationsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmergencyStationsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            stationType: expect.any(Object),
            wheelchairAccess: expect.any(Object),
            parking: expect.any(Object),
            latitude: expect.any(Object),
            longitude: expect.any(Object),
          })
        );
      });

      it('passing IEmergencyStations should create a new form with FormGroup', () => {
        const formGroup = service.createEmergencyStationsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            stationType: expect.any(Object),
            wheelchairAccess: expect.any(Object),
            parking: expect.any(Object),
            latitude: expect.any(Object),
            longitude: expect.any(Object),
          })
        );
      });
    });

    describe('getEmergencyStations', () => {
      it('should return NewEmergencyStations for default EmergencyStations initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEmergencyStationsFormGroup(sampleWithNewData);

        const emergencyStations = service.getEmergencyStations(formGroup) as any;

        expect(emergencyStations).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmergencyStations for empty EmergencyStations initial value', () => {
        const formGroup = service.createEmergencyStationsFormGroup();

        const emergencyStations = service.getEmergencyStations(formGroup) as any;

        expect(emergencyStations).toMatchObject({});
      });

      it('should return IEmergencyStations', () => {
        const formGroup = service.createEmergencyStationsFormGroup(sampleWithRequiredData);

        const emergencyStations = service.getEmergencyStations(formGroup) as any;

        expect(emergencyStations).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmergencyStations should not enable id FormControl', () => {
        const formGroup = service.createEmergencyStationsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmergencyStations should disable id FormControl', () => {
        const formGroup = service.createEmergencyStationsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
