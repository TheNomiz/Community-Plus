import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../emergency-guide-page.test-samples';

import { EmergencyGuidePageFormService } from './emergency-guide-page-form.service';

describe('EmergencyGuidePage Form Service', () => {
  let service: EmergencyGuidePageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyGuidePageFormService);
  });

  describe('Service methods', () => {
    describe('createEmergencyGuidePageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmergencyGuidePageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            emergencyType: expect.any(Object),
          })
        );
      });

      it('passing IEmergencyGuidePage should create a new form with FormGroup', () => {
        const formGroup = service.createEmergencyGuidePageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            emergencyType: expect.any(Object),
          })
        );
      });
    });

    describe('getEmergencyGuidePage', () => {
      it('should return NewEmergencyGuidePage for default EmergencyGuidePage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEmergencyGuidePageFormGroup(sampleWithNewData);

        const emergencyGuidePage = service.getEmergencyGuidePage(formGroup) as any;

        expect(emergencyGuidePage).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmergencyGuidePage for empty EmergencyGuidePage initial value', () => {
        const formGroup = service.createEmergencyGuidePageFormGroup();

        const emergencyGuidePage = service.getEmergencyGuidePage(formGroup) as any;

        expect(emergencyGuidePage).toMatchObject({});
      });

      it('should return IEmergencyGuidePage', () => {
        const formGroup = service.createEmergencyGuidePageFormGroup(sampleWithRequiredData);

        const emergencyGuidePage = service.getEmergencyGuidePage(formGroup) as any;

        expect(emergencyGuidePage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmergencyGuidePage should not enable id FormControl', () => {
        const formGroup = service.createEmergencyGuidePageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmergencyGuidePage should disable id FormControl', () => {
        const formGroup = service.createEmergencyGuidePageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
