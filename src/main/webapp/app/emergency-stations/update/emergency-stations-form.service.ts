import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEmergencyStations, NewEmergencyStations } from '../emergency-stations.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmergencyStations for edit and NewEmergencyStationsFormGroupInput for create.
 */
type EmergencyStationsFormGroupInput = IEmergencyStations | PartialWithRequiredKeyOf<NewEmergencyStations>;

type EmergencyStationsFormDefaults = Pick<NewEmergencyStations, 'id' | 'wheelchairAccess' | 'parking'>;

type EmergencyStationsFormGroupContent = {
  id: FormControl<IEmergencyStations['id'] | NewEmergencyStations['id']>;
  name: FormControl<IEmergencyStations['name']>;
  stationType: FormControl<IEmergencyStations['stationType']>;
  wheelchairAccess: FormControl<IEmergencyStations['wheelchairAccess']>;
  parking: FormControl<IEmergencyStations['parking']>;
  latitude: FormControl<IEmergencyStations['latitude']>;
  longitude: FormControl<IEmergencyStations['longitude']>;
};

export type EmergencyStationsFormGroup = FormGroup<EmergencyStationsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmergencyStationsFormService {
  createEmergencyStationsFormGroup(emergencyStations: EmergencyStationsFormGroupInput = { id: null }): EmergencyStationsFormGroup {
    const emergencyStationsRawValue = {
      ...this.getFormDefaults(),
      ...emergencyStations,
    };
    return new FormGroup<EmergencyStationsFormGroupContent>({
      id: new FormControl(
        { value: emergencyStationsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(emergencyStationsRawValue.name, {
        validators: [Validators.required],
      }),
      stationType: new FormControl(emergencyStationsRawValue.stationType, {
        validators: [Validators.required],
      }),
      wheelchairAccess: new FormControl(emergencyStationsRawValue.wheelchairAccess),
      parking: new FormControl(emergencyStationsRawValue.parking),
      latitude: new FormControl(emergencyStationsRawValue.latitude, {
        validators: [Validators.required],
      }),
      longitude: new FormControl(emergencyStationsRawValue.longitude, {
        validators: [Validators.required],
      }),
    });
  }

  getEmergencyStations(form: EmergencyStationsFormGroup): IEmergencyStations | NewEmergencyStations {
    return form.getRawValue() as IEmergencyStations | NewEmergencyStations;
  }

  resetForm(form: EmergencyStationsFormGroup, emergencyStations: EmergencyStationsFormGroupInput): void {
    const emergencyStationsRawValue = { ...this.getFormDefaults(), ...emergencyStations };
    form.reset(
      {
        ...emergencyStationsRawValue,
        id: { value: emergencyStationsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EmergencyStationsFormDefaults {
    return {
      id: null,
      wheelchairAccess: false,
      parking: false,
    };
  }
}
