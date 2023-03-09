import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../lost-found-page.test-samples';

import { LostFoundPageFormService } from './lost-found-page-form.service';

describe('LostFoundPage Form Service', () => {
  let service: LostFoundPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LostFoundPageFormService);
  });

  describe('Service methods', () => {
    describe('createLostFoundPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLostFoundPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing ILostFoundPage should create a new form with FormGroup', () => {
        const formGroup = service.createLostFoundPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getLostFoundPage', () => {
      it('should return NewLostFoundPage for default LostFoundPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLostFoundPageFormGroup(sampleWithNewData);

        const lostFoundPage = service.getLostFoundPage(formGroup) as any;

        expect(lostFoundPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewLostFoundPage for empty LostFoundPage initial value', () => {
        const formGroup = service.createLostFoundPageFormGroup();

        const lostFoundPage = service.getLostFoundPage(formGroup) as any;

        expect(lostFoundPage).toMatchObject({});
      });

      it('should return ILostFoundPage', () => {
        const formGroup = service.createLostFoundPageFormGroup(sampleWithRequiredData);

        const lostFoundPage = service.getLostFoundPage(formGroup) as any;

        expect(lostFoundPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILostFoundPage should not enable id FormControl', () => {
        const formGroup = service.createLostFoundPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLostFoundPage should disable id FormControl', () => {
        const formGroup = service.createLostFoundPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
