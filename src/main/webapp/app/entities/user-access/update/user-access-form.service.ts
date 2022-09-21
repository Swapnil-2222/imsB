import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserAccess, NewUserAccess } from '../user-access.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserAccess for edit and NewUserAccessFormGroupInput for create.
 */
type UserAccessFormGroupInput = IUserAccess | PartialWithRequiredKeyOf<NewUserAccess>;

type UserAccessFormDefaults = Pick<NewUserAccess, 'id'>;

type UserAccessFormGroupContent = {
  id: FormControl<IUserAccess['id'] | NewUserAccess['id']>;
  level: FormControl<IUserAccess['level']>;
  accessId: FormControl<IUserAccess['accessId']>;
  lastModified: FormControl<IUserAccess['lastModified']>;
  lastModifiedBy: FormControl<IUserAccess['lastModifiedBy']>;
  securityUser: FormControl<IUserAccess['securityUser']>;
};

export type UserAccessFormGroup = FormGroup<UserAccessFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserAccessFormService {
  createUserAccessFormGroup(userAccess: UserAccessFormGroupInput = { id: null }): UserAccessFormGroup {
    const userAccessRawValue = {
      ...this.getFormDefaults(),
      ...userAccess,
    };
    return new FormGroup<UserAccessFormGroupContent>({
      id: new FormControl(
        { value: userAccessRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      level: new FormControl(userAccessRawValue.level),
      accessId: new FormControl(userAccessRawValue.accessId),
      lastModified: new FormControl(userAccessRawValue.lastModified, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(userAccessRawValue.lastModifiedBy, {
        validators: [Validators.required],
      }),
      securityUser: new FormControl(userAccessRawValue.securityUser),
    });
  }

  getUserAccess(form: UserAccessFormGroup): IUserAccess | NewUserAccess {
    return form.getRawValue() as IUserAccess | NewUserAccess;
  }

  resetForm(form: UserAccessFormGroup, userAccess: UserAccessFormGroupInput): void {
    const userAccessRawValue = { ...this.getFormDefaults(), ...userAccess };
    form.reset(
      {
        ...userAccessRawValue,
        id: { value: userAccessRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserAccessFormDefaults {
    return {
      id: null,
    };
  }
}
