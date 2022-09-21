import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProductInventory, NewProductInventory } from '../product-inventory.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProductInventory for edit and NewProductInventoryFormGroupInput for create.
 */
type ProductInventoryFormGroupInput = IProductInventory | PartialWithRequiredKeyOf<NewProductInventory>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IProductInventory | NewProductInventory> = Omit<T, 'inwardOutwardDate' | 'expiryDate'> & {
  inwardOutwardDate?: string | null;
  expiryDate?: string | null;
};

type ProductInventoryFormRawValue = FormValueOf<IProductInventory>;

type NewProductInventoryFormRawValue = FormValueOf<NewProductInventory>;

type ProductInventoryFormDefaults = Pick<
  NewProductInventory,
  'id' | 'inwardOutwardDate' | 'expiryDate' | 'isDeleted' | 'isActive' | 'wareHouses' | 'securityUsers'
>;

type ProductInventoryFormGroupContent = {
  id: FormControl<ProductInventoryFormRawValue['id'] | NewProductInventory['id']>;
  inwardOutwardDate: FormControl<ProductInventoryFormRawValue['inwardOutwardDate']>;
  inwardQty: FormControl<ProductInventoryFormRawValue['inwardQty']>;
  outwardQty: FormControl<ProductInventoryFormRawValue['outwardQty']>;
  totalQuanity: FormControl<ProductInventoryFormRawValue['totalQuanity']>;
  pricePerUnit: FormControl<ProductInventoryFormRawValue['pricePerUnit']>;
  lotNo: FormControl<ProductInventoryFormRawValue['lotNo']>;
  expiryDate: FormControl<ProductInventoryFormRawValue['expiryDate']>;
  inventoryTypeId: FormControl<ProductInventoryFormRawValue['inventoryTypeId']>;
  freeField1: FormControl<ProductInventoryFormRawValue['freeField1']>;
  freeField2: FormControl<ProductInventoryFormRawValue['freeField2']>;
  lastModified: FormControl<ProductInventoryFormRawValue['lastModified']>;
  lastModifiedBy: FormControl<ProductInventoryFormRawValue['lastModifiedBy']>;
  isDeleted: FormControl<ProductInventoryFormRawValue['isDeleted']>;
  isActive: FormControl<ProductInventoryFormRawValue['isActive']>;
  product: FormControl<ProductInventoryFormRawValue['product']>;
  purchaseQuotation: FormControl<ProductInventoryFormRawValue['purchaseQuotation']>;
  productTransaction: FormControl<ProductInventoryFormRawValue['productTransaction']>;
  wareHouses: FormControl<ProductInventoryFormRawValue['wareHouses']>;
  securityUsers: FormControl<ProductInventoryFormRawValue['securityUsers']>;
};

export type ProductInventoryFormGroup = FormGroup<ProductInventoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductInventoryFormService {
  createProductInventoryFormGroup(productInventory: ProductInventoryFormGroupInput = { id: null }): ProductInventoryFormGroup {
    const productInventoryRawValue = this.convertProductInventoryToProductInventoryRawValue({
      ...this.getFormDefaults(),
      ...productInventory,
    });
    return new FormGroup<ProductInventoryFormGroupContent>({
      id: new FormControl(
        { value: productInventoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      inwardOutwardDate: new FormControl(productInventoryRawValue.inwardOutwardDate),
      inwardQty: new FormControl(productInventoryRawValue.inwardQty),
      outwardQty: new FormControl(productInventoryRawValue.outwardQty),
      totalQuanity: new FormControl(productInventoryRawValue.totalQuanity),
      pricePerUnit: new FormControl(productInventoryRawValue.pricePerUnit),
      lotNo: new FormControl(productInventoryRawValue.lotNo),
      expiryDate: new FormControl(productInventoryRawValue.expiryDate),
      inventoryTypeId: new FormControl(productInventoryRawValue.inventoryTypeId),
      freeField1: new FormControl(productInventoryRawValue.freeField1),
      freeField2: new FormControl(productInventoryRawValue.freeField2),
      lastModified: new FormControl(productInventoryRawValue.lastModified),
      lastModifiedBy: new FormControl(productInventoryRawValue.lastModifiedBy),
      isDeleted: new FormControl(productInventoryRawValue.isDeleted),
      isActive: new FormControl(productInventoryRawValue.isActive),
      product: new FormControl(productInventoryRawValue.product),
      purchaseQuotation: new FormControl(productInventoryRawValue.purchaseQuotation),
      productTransaction: new FormControl(productInventoryRawValue.productTransaction),
      wareHouses: new FormControl(productInventoryRawValue.wareHouses ?? []),
      securityUsers: new FormControl(productInventoryRawValue.securityUsers ?? []),
    });
  }

  getProductInventory(form: ProductInventoryFormGroup): IProductInventory | NewProductInventory {
    return this.convertProductInventoryRawValueToProductInventory(
      form.getRawValue() as ProductInventoryFormRawValue | NewProductInventoryFormRawValue
    );
  }

  resetForm(form: ProductInventoryFormGroup, productInventory: ProductInventoryFormGroupInput): void {
    const productInventoryRawValue = this.convertProductInventoryToProductInventoryRawValue({
      ...this.getFormDefaults(),
      ...productInventory,
    });
    form.reset(
      {
        ...productInventoryRawValue,
        id: { value: productInventoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProductInventoryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      inwardOutwardDate: currentTime,
      expiryDate: currentTime,
      isDeleted: false,
      isActive: false,
      wareHouses: [],
      securityUsers: [],
    };
  }

  private convertProductInventoryRawValueToProductInventory(
    rawProductInventory: ProductInventoryFormRawValue | NewProductInventoryFormRawValue
  ): IProductInventory | NewProductInventory {
    return {
      ...rawProductInventory,
      inwardOutwardDate: dayjs(rawProductInventory.inwardOutwardDate, DATE_TIME_FORMAT),
      expiryDate: dayjs(rawProductInventory.expiryDate, DATE_TIME_FORMAT),
    };
  }

  private convertProductInventoryToProductInventoryRawValue(
    productInventory: IProductInventory | (Partial<NewProductInventory> & ProductInventoryFormDefaults)
  ): ProductInventoryFormRawValue | PartialWithRequiredKeyOf<NewProductInventoryFormRawValue> {
    return {
      ...productInventory,
      inwardOutwardDate: productInventory.inwardOutwardDate ? productInventory.inwardOutwardDate.format(DATE_TIME_FORMAT) : undefined,
      expiryDate: productInventory.expiryDate ? productInventory.expiryDate.format(DATE_TIME_FORMAT) : undefined,
      wareHouses: productInventory.wareHouses ?? [],
      securityUsers: productInventory.securityUsers ?? [],
    };
  }
}
