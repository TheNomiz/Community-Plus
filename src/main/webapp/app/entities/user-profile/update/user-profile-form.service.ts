import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserProfile, NewUserProfile } from '../user-profile.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserProfile for edit and NewUserProfileFormGroupInput for create.
 */
type UserProfileFormGroupInput = IUserProfile | PartialWithRequiredKeyOf<NewUserProfile>;

type UserProfileFormDefaults = Pick<NewUserProfile, 'id' | 'verified' | 'privateAccount' | 'gPS' | 'darkmode'>;

type UserProfileFormGroupContent = {
  id: FormControl<IUserProfile['id'] | NewUserProfile['id']>;
  username: FormControl<IUserProfile['username']>;
  firstnames: FormControl<IUserProfile['firstnames']>;
  lastname: FormControl<IUserProfile['lastname']>;
  password: FormControl<IUserProfile['password']>;
  email: FormControl<IUserProfile['email']>;
  language: FormControl<IUserProfile['language']>;
  verified: FormControl<IUserProfile['verified']>;
  privateAccount: FormControl<IUserProfile['privateAccount']>;
  age: FormControl<IUserProfile['age']>;
  accountType: FormControl<IUserProfile['accountType']>;
  occupation: FormControl<IUserProfile['occupation']>;
  streetAddress: FormControl<IUserProfile['streetAddress']>;
  city: FormControl<IUserProfile['city']>;
  postalCode: FormControl<IUserProfile['postalCode']>;
  bio: FormControl<IUserProfile['bio']>;
  phoneNumber: FormControl<IUserProfile['phoneNumber']>;
  communityPoints: FormControl<IUserProfile['communityPoints']>;
  gPS: FormControl<IUserProfile['gPS']>;
  darkmode: FormControl<IUserProfile['darkmode']>;
  fontsize: FormControl<IUserProfile['fontsize']>;
  userID: FormControl<IUserProfile['userID']>;
};

export type UserProfileFormGroup = FormGroup<UserProfileFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserProfileFormService {
  createUserProfileFormGroup(userProfile: UserProfileFormGroupInput = { id: null }): UserProfileFormGroup {
    const userProfileRawValue = {
      ...this.getFormDefaults(),
      ...userProfile,
    };
    return new FormGroup<UserProfileFormGroupContent>({
      id: new FormControl(
        { value: userProfileRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      username: new FormControl(userProfileRawValue.username, {
        validators: [Validators.required],
      }),
      firstnames: new FormControl(userProfileRawValue.firstnames, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(20)],
      }),
      lastname: new FormControl(userProfileRawValue.lastname, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(20)],
      }),
      password: new FormControl(userProfileRawValue.password, {
        validators: [Validators.required],
      }),
      email: new FormControl(userProfileRawValue.email, {
        validators: [Validators.required],
      }),
      language: new FormControl(userProfileRawValue.language, {
        validators: [Validators.required],
      }),
      verified: new FormControl(userProfileRawValue.verified, {
        validators: [Validators.required],
      }),
      privateAccount: new FormControl(userProfileRawValue.privateAccount, {
        validators: [Validators.required],
      }),
      age: new FormControl(userProfileRawValue.age, {
        validators: [Validators.required],
      }),
      accountType: new FormControl(userProfileRawValue.accountType, {
        validators: [Validators.required],
      }),
      occupation: new FormControl(userProfileRawValue.occupation, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
      }),
      streetAddress: new FormControl(userProfileRawValue.streetAddress),
      city: new FormControl(userProfileRawValue.city),
      postalCode: new FormControl(userProfileRawValue.postalCode, {
        validators: [Validators.required],
      }),
      bio: new FormControl(userProfileRawValue.bio, {
        validators: [Validators.minLength(1), Validators.maxLength(150)],
      }),
      phoneNumber: new FormControl(userProfileRawValue.phoneNumber, {
        validators: [Validators.required, Validators.minLength(11)],
      }),
      communityPoints: new FormControl(userProfileRawValue.communityPoints),
      gPS: new FormControl(userProfileRawValue.gPS, {
        validators: [Validators.required],
      }),
      darkmode: new FormControl(userProfileRawValue.darkmode),
      fontsize: new FormControl(userProfileRawValue.fontsize),
      userID: new FormControl(userProfileRawValue.userID),
    });
  }

  getUserProfile(form: UserProfileFormGroup): IUserProfile | NewUserProfile {
    return form.getRawValue() as IUserProfile | NewUserProfile;
  }

  resetForm(form: UserProfileFormGroup, userProfile: UserProfileFormGroupInput): void {
    const userProfileRawValue = { ...this.getFormDefaults(), ...userProfile };
    form.reset(
      {
        ...userProfileRawValue,
        id: { value: userProfileRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserProfileFormDefaults {
    return {
      id: null,
      verified: false,
      privateAccount: false,
      gPS: false,
      darkmode: false,
    };
  }
}
