import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILostFound, NewLostFound } from '../lost-found.model';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILostFound for edit and NewLostFoundFormGroupInput for create.
 */
type LostFoundFormGroupInput = ILostFound | PartialWithRequiredKeyOf<NewLostFound>;

type FormValueOf<T extends ILostFound | NewLostFound> = Omit<T, 'date'> & {
  date?: string | null;
};

type LostFoundFormRawValue = FormValueOf<ILostFound>;
type NewLostFoundFormRawValue = FormValueOf<NewLostFound>;
type LostFoundFormDefaults = Pick<NewLostFound, 'id' | 'date'>;

type LostFoundFormGroupContent = {
  id: FormControl<LostFoundFormRawValue['id'] | NewLostFound['id']>;
  description: FormControl<LostFoundFormRawValue['description']>;
  date: FormControl<LostFoundFormRawValue['date']>;
  location: FormControl<LostFoundFormRawValue['location']>;
  item: FormControl<LostFoundFormRawValue['item']>;
  name: FormControl<LostFoundFormRawValue['name']>;
  email: FormControl<LostFoundFormRawValue['email']>;
  phoneNumber: FormControl<LostFoundFormRawValue['phoneNumber']>;
  postedby: FormControl<LostFoundFormRawValue['postedby']>;
  lostItems: FormControl<LostFoundFormRawValue['lostItems']>;
};

export type LostFoundFormGroup = FormGroup<LostFoundFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LostFoundFormService {
  createLostFoundFormGroup(lostFound: LostFoundFormGroupInput = { id: null }): LostFoundFormGroup {
    const lostFoundRawValue = this.convertLostFoundToLostFoundRawValue({
      ...this.getFormDefaults(),
      ...lostFound,
    });
    return new FormGroup<LostFoundFormGroupContent>({
      id: new FormControl(
        { value: lostFoundRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(lostFoundRawValue.description, {
        validators: [Validators.required],
      }),
      date: new FormControl(lostFoundRawValue.date, {
        validators: [Validators.required],
      }),
      location: new FormControl(lostFoundRawValue.location, {
        validators: [Validators.required],
      }),
      item: new FormControl(lostFoundRawValue.item, {
        validators: [Validators.required],
      }),
      name: new FormControl(lostFoundRawValue.name, {
        validators: [Validators.required],
      }),
      email: new FormControl(lostFoundRawValue.email, {
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl(lostFoundRawValue.phoneNumber, {
        validators: [Validators.required, Validators.minLength(11)],
      }),
      postedby: new FormControl(lostFoundRawValue.postedby),
      lostItems: new FormControl(lostFoundRawValue.lostItems ?? []),
    });
  }

  getLostFound(form: LostFoundFormGroup): ILostFound | NewLostFound {
    return this.convertLostFoundValueToLostFOund(form.getRawValue() as LostFoundFormRawValue | NewLostFoundFormRawValue);
  }

  resetForm(form: LostFoundFormGroup, lostFound: LostFoundFormGroupInput): void {
    const lostFoundRawValue = this.convertLostFoundToLostFoundRawValue({ ...this.getFormDefaults(), ...lostFound });
    form.reset(
      {
        ...lostFoundRawValue,
        id: { value: lostFoundRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LostFoundFormDefaults {
    const currentTime = dayjs();
    return {
      id: null,
      date: currentTime,
    };
  }

  private convertLostFoundValueToLostFOund(lostFound: LostFoundFormRawValue | NewLostFoundFormRawValue): ILostFound | NewLostFound {
    return {
      ...lostFound,
      date: dayjs(lostFound.date, DATE_TIME_FORMAT),
    };
  }

  private convertLostFoundToLostFoundRawValue(
    lostFound: ILostFound | (Partial<NewLostFound> & LostFoundFormDefaults)
  ): LostFoundFormRawValue | PartialWithRequiredKeyOf<NewLostFoundFormRawValue> {
    return {
      ...lostFound,
      date: lostFound.date ? lostFound.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
