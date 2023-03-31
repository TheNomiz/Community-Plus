import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICrimeAlert, NewCrimeAlert } from '../crime-alert.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICrimeAlert for edit and NewCrimeAlertFormGroupInput for create.
 */
type CrimeAlertFormGroupInput = ICrimeAlert | PartialWithRequiredKeyOf<NewCrimeAlert>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICrimeAlert | NewCrimeAlert> = Omit<T, 'date'> & {
  date?: string | null;
};

type CrimeAlertFormRawValue = FormValueOf<ICrimeAlert>;

type NewCrimeAlertFormRawValue = FormValueOf<NewCrimeAlert>;

type CrimeAlertFormDefaults = Pick<NewCrimeAlert, 'id' | 'date'>;

type CrimeAlertFormGroupContent = {
  id: FormControl<CrimeAlertFormRawValue['id'] | NewCrimeAlert['id']>;
  title: FormControl<CrimeAlertFormRawValue['title']>;
  description: FormControl<CrimeAlertFormRawValue['description']>;
  lat: FormControl<CrimeAlertFormRawValue['lat']>;
  lon: FormControl<CrimeAlertFormRawValue['lon']>;
  date: FormControl<CrimeAlertFormRawValue['date']>;
  crimeID: FormControl<CrimeAlertFormRawValue['crimeID']>;
  crimeType: FormControl<CrimeAlertFormRawValue['crimeType']>;
  postedby: FormControl<CrimeAlertFormRawValue['postedby']>;
};

export type CrimeAlertFormGroup = FormGroup<CrimeAlertFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CrimeAlertFormService {
  createCrimeAlertFormGroup(crimeAlert: CrimeAlertFormGroupInput = { id: null }): CrimeAlertFormGroup {
    const crimeAlertRawValue = this.convertCrimeAlertToCrimeAlertRawValue({
      ...this.getFormDefaults(),
      ...crimeAlert,
    });
    return new FormGroup<CrimeAlertFormGroupContent>({
      id: new FormControl(
        { value: crimeAlertRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(crimeAlertRawValue.title, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
      }),
      description: new FormControl(crimeAlertRawValue.description, {
        validators: [Validators.required, Validators.minLength(20)],
      }),
      lat: new FormControl(crimeAlertRawValue.lat, {
        validators: [Validators.required],
      }),
      lon: new FormControl(crimeAlertRawValue.lon, {
        validators: [Validators.required],
      }),
      date: new FormControl(crimeAlertRawValue.date, {
        validators: [Validators.required],
      }),
      crimeID: new FormControl(crimeAlertRawValue.crimeID, {
        validators: [Validators.required],
      }),
      crimeType: new FormControl(crimeAlertRawValue.crimeType, {
        validators: [Validators.required],
      }),
      postedby: new FormControl(crimeAlertRawValue.postedby, {
        validators: [Validators.required],
      }),
    });
  }

  getCrimeAlert(form: CrimeAlertFormGroup): ICrimeAlert | NewCrimeAlert {
    return this.convertCrimeAlertRawValueToCrimeAlert(form.getRawValue() as CrimeAlertFormRawValue | NewCrimeAlertFormRawValue);
  }

  resetForm(form: CrimeAlertFormGroup, crimeAlert: CrimeAlertFormGroupInput): void {
    const crimeAlertRawValue = this.convertCrimeAlertToCrimeAlertRawValue({ ...this.getFormDefaults(), ...crimeAlert });
    form.reset(
      {
        ...crimeAlertRawValue,
        id: { value: crimeAlertRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CrimeAlertFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertCrimeAlertRawValueToCrimeAlert(
    rawCrimeAlert: CrimeAlertFormRawValue | NewCrimeAlertFormRawValue
  ): ICrimeAlert | NewCrimeAlert {
    return {
      ...rawCrimeAlert,
      date: dayjs(rawCrimeAlert.date, DATE_TIME_FORMAT),
    };
  }

  private convertCrimeAlertToCrimeAlertRawValue(
    crimeAlert: ICrimeAlert | (Partial<NewCrimeAlert> & CrimeAlertFormDefaults)
  ): CrimeAlertFormRawValue | PartialWithRequiredKeyOf<NewCrimeAlertFormRawValue> {
    return {
      ...crimeAlert,
      date: crimeAlert.date ? crimeAlert.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
