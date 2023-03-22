import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILostFound, NewLostFound } from '../lost-found.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILostFound for edit and NewLostFoundFormGroupInput for create.
 */
type LostFoundFormGroupInput = ILostFound | PartialWithRequiredKeyOf<NewLostFound>;

type LostFoundFormDefaults = Pick<NewLostFound, 'id' | 'lostItems'>;

type LostFoundFormGroupContent = {
  id: FormControl<ILostFound['id'] | NewLostFound['id']>;
  description: FormControl<ILostFound['description']>;
  date: FormControl<ILostFound['date']>;
  location: FormControl<ILostFound['location']>;
  item: FormControl<ILostFound['item']>;
  name: FormControl<ILostFound['name']>;
  email: FormControl<ILostFound['email']>;
  phoneNumber: FormControl<ILostFound['phoneNumber']>;
  postedby: FormControl<ILostFound['postedby']>;
  lostItems: FormControl<ILostFound['lostItems']>;
};

export type LostFoundFormGroup = FormGroup<LostFoundFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LostFoundFormService {
  createLostFoundFormGroup(lostFound: LostFoundFormGroupInput = { id: null }): LostFoundFormGroup {
    const lostFoundRawValue = {
      ...this.getFormDefaults(),
      ...lostFound,
    };
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
    return form.getRawValue() as ILostFound | NewLostFound;
  }

  resetForm(form: LostFoundFormGroup, lostFound: LostFoundFormGroupInput): void {
    const lostFoundRawValue = { ...this.getFormDefaults(), ...lostFound };
    form.reset(
      {
        ...lostFoundRawValue,
        id: { value: lostFoundRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LostFoundFormDefaults {
    return {
      id: null,
      lostItems: [],
    };
  }
}
