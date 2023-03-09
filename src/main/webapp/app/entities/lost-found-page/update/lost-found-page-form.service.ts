import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILostFoundPage, NewLostFoundPage } from '../lost-found-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILostFoundPage for edit and NewLostFoundPageFormGroupInput for create.
 */
type LostFoundPageFormGroupInput = ILostFoundPage | PartialWithRequiredKeyOf<NewLostFoundPage>;

type LostFoundPageFormDefaults = Pick<NewLostFoundPage, 'id'>;

type LostFoundPageFormGroupContent = {
  id: FormControl<ILostFoundPage['id'] | NewLostFoundPage['id']>;
  description: FormControl<ILostFoundPage['description']>;
};

export type LostFoundPageFormGroup = FormGroup<LostFoundPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LostFoundPageFormService {
  createLostFoundPageFormGroup(lostFoundPage: LostFoundPageFormGroupInput = { id: null }): LostFoundPageFormGroup {
    const lostFoundPageRawValue = {
      ...this.getFormDefaults(),
      ...lostFoundPage,
    };
    return new FormGroup<LostFoundPageFormGroupContent>({
      id: new FormControl(
        { value: lostFoundPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(lostFoundPageRawValue.description, {
        validators: [Validators.required],
      }),
    });
  }

  getLostFoundPage(form: LostFoundPageFormGroup): ILostFoundPage | NewLostFoundPage {
    return form.getRawValue() as ILostFoundPage | NewLostFoundPage;
  }

  resetForm(form: LostFoundPageFormGroup, lostFoundPage: LostFoundPageFormGroupInput): void {
    const lostFoundPageRawValue = { ...this.getFormDefaults(), ...lostFoundPage };
    form.reset(
      {
        ...lostFoundPageRawValue,
        id: { value: lostFoundPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LostFoundPageFormDefaults {
    return {
      id: null,
    };
  }
}
