import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEmergencyGuidePage, NewEmergencyGuidePage } from '../emergency-guide-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmergencyGuidePage for edit and NewEmergencyGuidePageFormGroupInput for create.
 */
type EmergencyGuidePageFormGroupInput = IEmergencyGuidePage | PartialWithRequiredKeyOf<NewEmergencyGuidePage>;

type EmergencyGuidePageFormDefaults = Pick<NewEmergencyGuidePage, 'id'>;

type EmergencyGuidePageFormGroupContent = {
  id: FormControl<IEmergencyGuidePage['id'] | NewEmergencyGuidePage['id']>;
  emergencyType: FormControl<IEmergencyGuidePage['emergencyType']>;
};

export type EmergencyGuidePageFormGroup = FormGroup<EmergencyGuidePageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmergencyGuidePageFormService {
  createEmergencyGuidePageFormGroup(emergencyGuidePage: EmergencyGuidePageFormGroupInput = { id: null }): EmergencyGuidePageFormGroup {
    const emergencyGuidePageRawValue = {
      ...this.getFormDefaults(),
      ...emergencyGuidePage,
    };
    return new FormGroup<EmergencyGuidePageFormGroupContent>({
      id: new FormControl(
        { value: emergencyGuidePageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      emergencyType: new FormControl(emergencyGuidePageRawValue.emergencyType, {
        validators: [Validators.required],
      }),
    });
  }

  getEmergencyGuidePage(form: EmergencyGuidePageFormGroup): IEmergencyGuidePage | NewEmergencyGuidePage {
    return form.getRawValue() as IEmergencyGuidePage | NewEmergencyGuidePage;
  }

  resetForm(form: EmergencyGuidePageFormGroup, emergencyGuidePage: EmergencyGuidePageFormGroupInput): void {
    const emergencyGuidePageRawValue = { ...this.getFormDefaults(), ...emergencyGuidePage };
    form.reset(
      {
        ...emergencyGuidePageRawValue,
        id: { value: emergencyGuidePageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EmergencyGuidePageFormDefaults {
    return {
      id: null,
    };
  }
}
