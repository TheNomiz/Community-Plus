import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBusiness, NewBusiness } from '../business.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBusiness for edit and NewBusinessFormGroupInput for create.
 */
type BusinessFormGroupInput = IBusiness | PartialWithRequiredKeyOf<NewBusiness>;

type BusinessFormDefaults = Pick<NewBusiness, 'id' | 'businessrooms'>;

type BusinessFormGroupContent = {
  id: FormControl<IBusiness['id'] | NewBusiness['id']>;
  name: FormControl<IBusiness['name']>;
  description: FormControl<IBusiness['description']>;
  category: FormControl<IBusiness['category']>;
  phoneNumber: FormControl<IBusiness['phoneNumber']>;
  email: FormControl<IBusiness['email']>;
  websiteUrl: FormControl<IBusiness['websiteUrl']>;
  latitude: FormControl<IBusiness['latitude']>;
  longitude: FormControl<IBusiness['longitude']>;
  postedby: FormControl<IBusiness['postedby']>;
  businessrooms: FormControl<IBusiness['businessrooms']>;
};

export type BusinessFormGroup = FormGroup<BusinessFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BusinessFormService {
  createBusinessFormGroup(business: BusinessFormGroupInput = { id: null }): BusinessFormGroup {
    const businessRawValue = {
      ...this.getFormDefaults(),
      ...business,
    };
    return new FormGroup<BusinessFormGroupContent>({
      id: new FormControl(
        { value: businessRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(businessRawValue.name, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
      }),
      description: new FormControl(businessRawValue.description, {
        validators: [Validators.required],
      }),
      category: new FormControl(businessRawValue.category, {
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl(businessRawValue.phoneNumber, {
        validators: [Validators.required, Validators.minLength(11)],
      }),
      email: new FormControl(businessRawValue.email, {
        validators: [Validators.required, Validators.maxLength(254)],
      }),
      websiteUrl: new FormControl(businessRawValue.websiteUrl, {
        validators: [Validators.maxLength(255)],
      }),
      latitude: new FormControl(businessRawValue.latitude, {
        validators: [Validators.required],
      }),
      longitude: new FormControl(businessRawValue.longitude, {
        validators: [Validators.required],
      }),
      postedby: new FormControl(businessRawValue.postedby),
      businessrooms: new FormControl(businessRawValue.businessrooms ?? []),
    });
  }

  getBusiness(form: BusinessFormGroup): IBusiness | NewBusiness {
    return form.getRawValue() as IBusiness | NewBusiness;
  }

  resetForm(form: BusinessFormGroup, business: BusinessFormGroupInput): void {
    const businessRawValue = { ...this.getFormDefaults(), ...business };
    form.reset(
      {
        ...businessRawValue,
        id: { value: businessRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BusinessFormDefaults {
    return {
      id: null,
      businessrooms: [],
    };
  }
}
