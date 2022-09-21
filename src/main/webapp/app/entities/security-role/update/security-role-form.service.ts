import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISecurityRole, NewSecurityRole } from '../security-role.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISecurityRole for edit and NewSecurityRoleFormGroupInput for create.
 */
type SecurityRoleFormGroupInput = ISecurityRole | PartialWithRequiredKeyOf<NewSecurityRole>;

type SecurityRoleFormDefaults = Pick<NewSecurityRole, 'id' | 'securityPermissions' | 'securityUsers'>;

type SecurityRoleFormGroupContent = {
  id: FormControl<ISecurityRole['id'] | NewSecurityRole['id']>;
  name: FormControl<ISecurityRole['name']>;
  description: FormControl<ISecurityRole['description']>;
  lastModified: FormControl<ISecurityRole['lastModified']>;
  lastModifiedBy: FormControl<ISecurityRole['lastModifiedBy']>;
  securityPermissions: FormControl<ISecurityRole['securityPermissions']>;
  securityUsers: FormControl<ISecurityRole['securityUsers']>;
};

export type SecurityRoleFormGroup = FormGroup<SecurityRoleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SecurityRoleFormService {
  createSecurityRoleFormGroup(securityRole: SecurityRoleFormGroupInput = { id: null }): SecurityRoleFormGroup {
    const securityRoleRawValue = {
      ...this.getFormDefaults(),
      ...securityRole,
    };
    return new FormGroup<SecurityRoleFormGroupContent>({
      id: new FormControl(
        { value: securityRoleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(securityRoleRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(securityRoleRawValue.description),
      lastModified: new FormControl(securityRoleRawValue.lastModified, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(securityRoleRawValue.lastModifiedBy, {
        validators: [Validators.required],
      }),
      securityPermissions: new FormControl(securityRoleRawValue.securityPermissions ?? []),
      securityUsers: new FormControl(securityRoleRawValue.securityUsers ?? []),
    });
  }

  getSecurityRole(form: SecurityRoleFormGroup): ISecurityRole | NewSecurityRole {
    return form.getRawValue() as ISecurityRole | NewSecurityRole;
  }

  resetForm(form: SecurityRoleFormGroup, securityRole: SecurityRoleFormGroupInput): void {
    const securityRoleRawValue = { ...this.getFormDefaults(), ...securityRole };
    form.reset(
      {
        ...securityRoleRawValue,
        id: { value: securityRoleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SecurityRoleFormDefaults {
    return {
      id: null,
      securityPermissions: [],
      securityUsers: [],
    };
  }
}
