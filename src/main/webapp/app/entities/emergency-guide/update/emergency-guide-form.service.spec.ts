import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../emergency-guide.test-samples';

import { EmergencyGuideFormService } from './emergency-guide-form.service';

describe('EmergencyGuide Form Service', () => {
  let service: EmergencyGuideFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyGuideFormService);
  });

  describe('Service methods', () => {
    describe('createEmergencyGuideFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmergencyGuideFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            emergencyType: expect.any(Object),
            panicButton: expect.any(Object),
          })
        );
      });

      it('passing IEmergencyGuide should create a new form with FormGroup', () => {
        const formGroup = service.createEmergencyGuideFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            emergencyType: expect.any(Object),
            panicButton: expect.any(Object),
          })
        );
      });
    });

    describe('getEmergencyGuide', () => {
      it('should return NewEmergencyGuide for default EmergencyGuide initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEmergencyGuideFormGroup(sampleWithNewData);

        const emergencyGuide = service.getEmergencyGuide(formGroup) as any;

        expect(emergencyGuide).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmergencyGuide for empty EmergencyGuide initial value', () => {
        const formGroup = service.createEmergencyGuideFormGroup();

        const emergencyGuide = service.getEmergencyGuide(formGroup) as any;

        expect(emergencyGuide).toMatchObject({});
      });

      it('should return IEmergencyGuide', () => {
        const formGroup = service.createEmergencyGuideFormGroup(sampleWithRequiredData);

        const emergencyGuide = service.getEmergencyGuide(formGroup) as any;

        expect(emergencyGuide).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmergencyGuide should not enable id FormControl', () => {
        const formGroup = service.createEmergencyGuideFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmergencyGuide should disable id FormControl', () => {
        const formGroup = service.createEmergencyGuideFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
