import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IWareHouse, NewWareHouse } from '../ware-house.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWareHouse for edit and NewWareHouseFormGroupInput for create.
 */
type WareHouseFormGroupInput = IWareHouse | PartialWithRequiredKeyOf<NewWareHouse>;

type WareHouseFormDefaults = Pick<NewWareHouse, 'id' | 'isDeleted' | 'isActive' | 'productInventories' | 'securityUsers'>;

type WareHouseFormGroupContent = {
  id: FormControl<IWareHouse['id'] | NewWareHouse['id']>;
  whName: FormControl<IWareHouse['whName']>;
  address: FormControl<IWareHouse['address']>;
  pincode: FormControl<IWareHouse['pincode']>;
  city: FormControl<IWareHouse['city']>;
  state: FormControl<IWareHouse['state']>;
  country: FormControl<IWareHouse['country']>;
  gSTDetails: FormControl<IWareHouse['gSTDetails']>;
  managerName: FormControl<IWareHouse['managerName']>;
  managerEmail: FormControl<IWareHouse['managerEmail']>;
  managerContact: FormControl<IWareHouse['managerContact']>;
  contact: FormControl<IWareHouse['contact']>;
  isDeleted: FormControl<IWareHouse['isDeleted']>;
  isActive: FormControl<IWareHouse['isActive']>;
  wareHouseId: FormControl<IWareHouse['wareHouseId']>;
  lastModified: FormControl<IWareHouse['lastModified']>;
  lastModifiedBy: FormControl<IWareHouse['lastModifiedBy']>;
  productInventories: FormControl<IWareHouse['productInventories']>;
  securityUsers: FormControl<IWareHouse['securityUsers']>;
};

export type WareHouseFormGroup = FormGroup<WareHouseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WareHouseFormService {
  createWareHouseFormGroup(wareHouse: WareHouseFormGroupInput = { id: null }): WareHouseFormGroup {
    const wareHouseRawValue = {
      ...this.getFormDefaults(),
      ...wareHouse,
    };
    return new FormGroup<WareHouseFormGroupContent>({
      id: new FormControl(
        { value: wareHouseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      whName: new FormControl(wareHouseRawValue.whName),
      address: new FormControl(wareHouseRawValue.address),
      pincode: new FormControl(wareHouseRawValue.pincode),
      city: new FormControl(wareHouseRawValue.city),
      state: new FormControl(wareHouseRawValue.state),
      country: new FormControl(wareHouseRawValue.country),
      gSTDetails: new FormControl(wareHouseRawValue.gSTDetails),
      managerName: new FormControl(wareHouseRawValue.managerName),
      managerEmail: new FormControl(wareHouseRawValue.managerEmail),
      managerContact: new FormControl(wareHouseRawValue.managerContact),
      contact: new FormControl(wareHouseRawValue.contact),
      isDeleted: new FormControl(wareHouseRawValue.isDeleted),
      isActive: new FormControl(wareHouseRawValue.isActive),
      wareHouseId: new FormControl(wareHouseRawValue.wareHouseId),
      lastModified: new FormControl(wareHouseRawValue.lastModified, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(wareHouseRawValue.lastModifiedBy, {
        validators: [Validators.required],
      }),
      productInventories: new FormControl(wareHouseRawValue.productInventories ?? []),
      securityUsers: new FormControl(wareHouseRawValue.securityUsers ?? []),
    });
  }

  getWareHouse(form: WareHouseFormGroup): IWareHouse | NewWareHouse {
    return form.getRawValue() as IWareHouse | NewWareHouse;
  }

  resetForm(form: WareHouseFormGroup, wareHouse: WareHouseFormGroupInput): void {
    const wareHouseRawValue = { ...this.getFormDefaults(), ...wareHouse };
    form.reset(
      {
        ...wareHouseRawValue,
        id: { value: wareHouseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WareHouseFormDefaults {
    return {
      id: null,
      isDeleted: false,
      isActive: false,
      productInventories: [],
      securityUsers: [],
    };
  }
}
