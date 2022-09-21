import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISecurityPermission, NewSecurityPermission } from '../security-permission.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISecurityPermission for edit and NewSecurityPermissionFormGroupInput for create.
 */
type SecurityPermissionFormGroupInput = ISecurityPermission | PartialWithRequiredKeyOf<NewSecurityPermission>;

type SecurityPermissionFormDefaults = Pick<NewSecurityPermission, 'id' | 'securityRoles' | 'securityUsers'>;

type SecurityPermissionFormGroupContent = {
  id: FormControl<ISecurityPermission['id'] | NewSecurityPermission['id']>;
  name: FormControl<ISecurityPermission['name']>;
  description: FormControl<ISecurityPermission['description']>;
  lastModified: FormControl<ISecurityPermission['lastModified']>;
  lastModifiedBy: FormControl<ISecurityPermission['lastModifiedBy']>;
  securityRoles: FormControl<ISecurityPermission['securityRoles']>;
  securityUsers: FormControl<ISecurityPermission['securityUsers']>;
};

export type SecurityPermissionFormGroup = FormGroup<SecurityPermissionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SecurityPermissionFormService {
  createSecurityPermissionFormGroup(securityPermission: SecurityPermissionFormGroupInput = { id: null }): SecurityPermissionFormGroup {
    const securityPermissionRawValue = {
      ...this.getFormDefaults(),
      ...securityPermission,
    };
    return new FormGroup<SecurityPermissionFormGroupContent>({
      id: new FormControl(
        { value: securityPermissionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(securityPermissionRawValue.name, {
        validators: [Validators.required],
      }),
      description: new FormControl(securityPermissionRawValue.description),
      lastModified: new FormControl(securityPermissionRawValue.lastModified, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(securityPermissionRawValue.lastModifiedBy, {
        validators: [Validators.required],
      }),
      securityRoles: new FormControl(securityPermissionRawValue.securityRoles ?? []),
      securityUsers: new FormControl(securityPermissionRawValue.securityUsers ?? []),
    });
  }

  getSecurityPermission(form: SecurityPermissionFormGroup): ISecurityPermission | NewSecurityPermission {
    return form.getRawValue() as ISecurityPermission | NewSecurityPermission;
  }

  resetForm(form: SecurityPermissionFormGroup, securityPermission: SecurityPermissionFormGroupInput): void {
    const securityPermissionRawValue = { ...this.getFormDefaults(), ...securityPermission };
    form.reset(
      {
        ...securityPermissionRawValue,
        id: { value: securityPermissionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SecurityPermissionFormDefaults {
    return {
      id: null,
      securityRoles: [],
      securityUsers: [],
    };
  }
}
