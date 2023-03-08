import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEvent, NewEvent } from '../event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvent for edit and NewEventFormGroupInput for create.
 */
type EventFormGroupInput = IEvent | PartialWithRequiredKeyOf<NewEvent>;

type EventFormDefaults = Pick<NewEvent, 'id' | 'eventrooms'>;

type EventFormGroupContent = {
  id: FormControl<IEvent['id'] | NewEvent['id']>;
  name: FormControl<IEvent['name']>;
  description: FormControl<IEvent['description']>;
  startDate: FormControl<IEvent['startDate']>;
  endDate: FormControl<IEvent['endDate']>;
  imageUrl: FormControl<IEvent['imageUrl']>;
  latitude: FormControl<IEvent['latitude']>;
  longitude: FormControl<IEvent['longitude']>;
  address: FormControl<IEvent['address']>;
  eventrooms: FormControl<IEvent['eventrooms']>;
};

export type EventFormGroup = FormGroup<EventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventFormService {
  createEventFormGroup(event: EventFormGroupInput = { id: null }): EventFormGroup {
    const eventRawValue = {
      ...this.getFormDefaults(),
      ...event,
    };
    return new FormGroup<EventFormGroupContent>({
      id: new FormControl(
        { value: eventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(eventRawValue.name, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
      }),
      description: new FormControl(eventRawValue.description, {
        validators: [Validators.required],
      }),
      startDate: new FormControl(eventRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(eventRawValue.endDate, {
        validators: [Validators.required],
      }),
      imageUrl: new FormControl(eventRawValue.imageUrl, {
        validators: [Validators.maxLength(255)],
      }),
      latitude: new FormControl(eventRawValue.latitude, {
        validators: [Validators.required],
      }),
      longitude: new FormControl(eventRawValue.longitude, {
        validators: [Validators.required],
      }),
      address: new FormControl(eventRawValue.address, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      eventrooms: new FormControl(eventRawValue.eventrooms ?? []),
    });
  }

  getEvent(form: EventFormGroup): IEvent | NewEvent {
    return form.getRawValue() as IEvent | NewEvent;
  }

  resetForm(form: EventFormGroup, event: EventFormGroupInput): void {
    const eventRawValue = { ...this.getFormDefaults(), ...event };
    form.reset(
      {
        ...eventRawValue,
        id: { value: eventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EventFormDefaults {
    return {
      id: null,
      eventrooms: [],
    };
  }
}
