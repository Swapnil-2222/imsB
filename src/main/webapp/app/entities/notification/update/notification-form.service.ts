import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { INotification, NewNotification } from '../notification.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INotification for edit and NewNotificationFormGroupInput for create.
 */
type NotificationFormGroupInput = INotification | PartialWithRequiredKeyOf<NewNotification>;

type NotificationFormDefaults = Pick<NewNotification, 'id' | 'isActionRequired'>;

type NotificationFormGroupContent = {
  id: FormControl<INotification['id'] | NewNotification['id']>;
  massage: FormControl<INotification['massage']>;
  notificationType: FormControl<INotification['notificationType']>;
  isActionRequired: FormControl<INotification['isActionRequired']>;
  freeField1: FormControl<INotification['freeField1']>;
  freeField2: FormControl<INotification['freeField2']>;
  lastModified: FormControl<INotification['lastModified']>;
  lastModifiedBy: FormControl<INotification['lastModifiedBy']>;
  securityUser: FormControl<INotification['securityUser']>;
  wareHouse: FormControl<INotification['wareHouse']>;
};

export type NotificationFormGroup = FormGroup<NotificationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NotificationFormService {
  createNotificationFormGroup(notification: NotificationFormGroupInput = { id: null }): NotificationFormGroup {
    const notificationRawValue = {
      ...this.getFormDefaults(),
      ...notification,
    };
    return new FormGroup<NotificationFormGroupContent>({
      id: new FormControl(
        { value: notificationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      massage: new FormControl(notificationRawValue.massage, {
        validators: [Validators.required],
      }),
      notificationType: new FormControl(notificationRawValue.notificationType),
      isActionRequired: new FormControl(notificationRawValue.isActionRequired),
      freeField1: new FormControl(notificationRawValue.freeField1),
      freeField2: new FormControl(notificationRawValue.freeField2),
      lastModified: new FormControl(notificationRawValue.lastModified, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(notificationRawValue.lastModifiedBy, {
        validators: [Validators.required],
      }),
      securityUser: new FormControl(notificationRawValue.securityUser),
      wareHouse: new FormControl(notificationRawValue.wareHouse),
    });
  }

  getNotification(form: NotificationFormGroup): INotification | NewNotification {
    return form.getRawValue() as INotification | NewNotification;
  }

  resetForm(form: NotificationFormGroup, notification: NotificationFormGroupInput): void {
    const notificationRawValue = { ...this.getFormDefaults(), ...notification };
    form.reset(
      {
        ...notificationRawValue,
        id: { value: notificationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): NotificationFormDefaults {
    return {
      id: null,
      isActionRequired: false,
    };
  }
}
