import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEmergencyGuide, NewEmergencyGuide } from '../emergency-guide.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmergencyGuide for edit and NewEmergencyGuideFormGroupInput for create.
 */
type EmergencyGuideFormGroupInput = IEmergencyGuide | PartialWithRequiredKeyOf<NewEmergencyGuide>;

type EmergencyGuideFormDefaults = Pick<NewEmergencyGuide, 'id' | 'panicButton'>;

type EmergencyGuideFormGroupContent = {
  id: FormControl<IEmergencyGuide['id'] | NewEmergencyGuide['id']>;
  emergencyType: FormControl<IEmergencyGuide['emergencyType']>;
  panicButton: FormControl<IEmergencyGuide['panicButton']>;
};

export type EmergencyGuideFormGroup = FormGroup<EmergencyGuideFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmergencyGuideFormService {
  createEmergencyGuideFormGroup(emergencyGuide: EmergencyGuideFormGroupInput = { id: null }): EmergencyGuideFormGroup {
    const emergencyGuideRawValue = {
      ...this.getFormDefaults(),
      ...emergencyGuide,
    };
    return new FormGroup<EmergencyGuideFormGroupContent>({
      id: new FormControl(
        { value: emergencyGuideRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      emergencyType: new FormControl(emergencyGuideRawValue.emergencyType, {
        validators: [Validators.required],
      }),
      panicButton: new FormControl(emergencyGuideRawValue.panicButton, {
        validators: [Validators.required],
      }),
    });
  }

  getEmergencyGuide(form: EmergencyGuideFormGroup): IEmergencyGuide | NewEmergencyGuide {
    return form.getRawValue() as IEmergencyGuide | NewEmergencyGuide;
  }

  resetForm(form: EmergencyGuideFormGroup, emergencyGuide: EmergencyGuideFormGroupInput): void {
    const emergencyGuideRawValue = { ...this.getFormDefaults(), ...emergencyGuide };
    form.reset(
      {
        ...emergencyGuideRawValue,
        id: { value: emergencyGuideRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EmergencyGuideFormDefaults {
    return {
      id: null,
      panicButton: false,
    };
  }
}
