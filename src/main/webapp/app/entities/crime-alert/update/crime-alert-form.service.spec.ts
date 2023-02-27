import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../crime-alert.test-samples';

import { CrimeAlertFormService } from './crime-alert-form.service';

describe('CrimeAlert Form Service', () => {
  let service: CrimeAlertFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrimeAlertFormService);
  });

  describe('Service methods', () => {
    describe('createCrimeAlertFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCrimeAlertFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            lat: expect.any(Object),
            lon: expect.any(Object),
            date: expect.any(Object),
            postedby: expect.any(Object),
          })
        );
      });

      it('passing ICrimeAlert should create a new form with FormGroup', () => {
        const formGroup = service.createCrimeAlertFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            lat: expect.any(Object),
            lon: expect.any(Object),
            date: expect.any(Object),
            postedby: expect.any(Object),
          })
        );
      });
    });

    describe('getCrimeAlert', () => {
      it('should return NewCrimeAlert for default CrimeAlert initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCrimeAlertFormGroup(sampleWithNewData);

        const crimeAlert = service.getCrimeAlert(formGroup) as any;

        expect(crimeAlert).toMatchObject(sampleWithNewData);
      });

      it('should return NewCrimeAlert for empty CrimeAlert initial value', () => {
        const formGroup = service.createCrimeAlertFormGroup();

        const crimeAlert = service.getCrimeAlert(formGroup) as any;

        expect(crimeAlert).toMatchObject({});
      });

      it('should return ICrimeAlert', () => {
        const formGroup = service.createCrimeAlertFormGroup(sampleWithRequiredData);

        const crimeAlert = service.getCrimeAlert(formGroup) as any;

        expect(crimeAlert).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICrimeAlert should not enable id FormControl', () => {
        const formGroup = service.createCrimeAlertFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCrimeAlert should disable id FormControl', () => {
        const formGroup = service.createCrimeAlertFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
