import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../lost-found.test-samples';

import { LostFoundFormService } from './lost-found-form.service';

describe('LostFound Form Service', () => {
  let service: LostFoundFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LostFoundFormService);
  });

  describe('Service methods', () => {
    describe('createLostFoundFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLostFoundFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            location: expect.any(Object),
            item: expect.any(Object),
            name: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            postedby: expect.any(Object),
            lostItems: expect.any(Object),
          })
        );
      });

      it('passing ILostFound should create a new form with FormGroup', () => {
        const formGroup = service.createLostFoundFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            location: expect.any(Object),
            item: expect.any(Object),
            name: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            postedby: expect.any(Object),
            lostItems: expect.any(Object),
          })
        );
      });
    });

    describe('getLostFound', () => {
      it('should return NewLostFound for default LostFound initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLostFoundFormGroup(sampleWithNewData);

        const lostFound = service.getLostFound(formGroup) as any;

        expect(lostFound).toMatchObject(sampleWithNewData);
      });

      it('should return NewLostFound for empty LostFound initial value', () => {
        const formGroup = service.createLostFoundFormGroup();

        const lostFound = service.getLostFound(formGroup) as any;

        expect(lostFound).toMatchObject({});
      });

      it('should return ILostFound', () => {
        const formGroup = service.createLostFoundFormGroup(sampleWithRequiredData);

        const lostFound = service.getLostFound(formGroup) as any;

        expect(lostFound).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILostFound should not enable id FormControl', () => {
        const formGroup = service.createLostFoundFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLostFound should disable id FormControl', () => {
        const formGroup = service.createLostFoundFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
