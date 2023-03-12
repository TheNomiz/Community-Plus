import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEmergencyStationsPage, NewEmergencyStationsPage } from '../emergency-stations-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmergencyStationsPage for edit and NewEmergencyStationsPageFormGroupInput for create.
 */
type EmergencyStationsPageFormGroupInput = IEmergencyStationsPage | PartialWithRequiredKeyOf<NewEmergencyStationsPage>;

type EmergencyStationsPageFormDefaults = Pick<NewEmergencyStationsPage, 'id'>;

type EmergencyStationsPageFormGroupContent = {
  id: FormControl<IEmergencyStationsPage['id'] | NewEmergencyStationsPage['id']>;
  name: FormControl<IEmergencyStationsPage['name']>;
  stationType: FormControl<IEmergencyStationsPage['stationType']>;
  latitude: FormControl<IEmergencyStationsPage['latitude']>;
  longitude: FormControl<IEmergencyStationsPage['longitude']>;
};

export type EmergencyStationsPageFormGroup = FormGroup<EmergencyStationsPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmergencyStationsPageFormService {
  createEmergencyStationsPageFormGroup(
    emergencyStationsPage: EmergencyStationsPageFormGroupInput = { id: null }
  ): EmergencyStationsPageFormGroup {
    const emergencyStationsPageRawValue = {
      ...this.getFormDefaults(),
      ...emergencyStationsPage,
    };
    return new FormGroup<EmergencyStationsPageFormGroupContent>({
      id: new FormControl(
        { value: emergencyStationsPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(emergencyStationsPageRawValue.name, {
        validators: [Validators.required],
      }),
      stationType: new FormControl(emergencyStationsPageRawValue.stationType, {
        validators: [Validators.required],
      }),
      latitude: new FormControl(emergencyStationsPageRawValue.latitude, {
        validators: [Validators.required],
      }),
      longitude: new FormControl(emergencyStationsPageRawValue.longitude, {
        validators: [Validators.required],
      }),
    });
  }

  getEmergencyStationsPage(form: EmergencyStationsPageFormGroup): IEmergencyStationsPage | NewEmergencyStationsPage {
    return form.getRawValue() as IEmergencyStationsPage | NewEmergencyStationsPage;
  }

  resetForm(form: EmergencyStationsPageFormGroup, emergencyStationsPage: EmergencyStationsPageFormGroupInput): void {
    const emergencyStationsPageRawValue = { ...this.getFormDefaults(), ...emergencyStationsPage };
    form.reset(
      {
        ...emergencyStationsPageRawValue,
        id: { value: emergencyStationsPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EmergencyStationsPageFormDefaults {
    return {
      id: null,
    };
  }
}
