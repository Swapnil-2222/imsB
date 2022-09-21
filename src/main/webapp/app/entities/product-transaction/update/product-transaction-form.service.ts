import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProductTransaction, NewProductTransaction } from '../product-transaction.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProductTransaction for edit and NewProductTransactionFormGroupInput for create.
 */
type ProductTransactionFormGroupInput = IProductTransaction | PartialWithRequiredKeyOf<NewProductTransaction>;

type ProductTransactionFormDefaults = Pick<NewProductTransaction, 'id'>;

type ProductTransactionFormGroupContent = {
  id: FormControl<IProductTransaction['id'] | NewProductTransaction['id']>;
  refrenceId: FormControl<IProductTransaction['refrenceId']>;
  transactionType: FormControl<IProductTransaction['transactionType']>;
  transactionStatus: FormControl<IProductTransaction['transactionStatus']>;
  transactionDate: FormControl<IProductTransaction['transactionDate']>;
  description: FormControl<IProductTransaction['description']>;
  freeField1: FormControl<IProductTransaction['freeField1']>;
  freeField2: FormControl<IProductTransaction['freeField2']>;
  lastModified: FormControl<IProductTransaction['lastModified']>;
  lastModifiedBy: FormControl<IProductTransaction['lastModifiedBy']>;
  securityUser: FormControl<IProductTransaction['securityUser']>;
  wareHouse: FormControl<IProductTransaction['wareHouse']>;
};

export type ProductTransactionFormGroup = FormGroup<ProductTransactionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductTransactionFormService {
  createProductTransactionFormGroup(productTransaction: ProductTransactionFormGroupInput = { id: null }): ProductTransactionFormGroup {
    const productTransactionRawValue = {
      ...this.getFormDefaults(),
      ...productTransaction,
    };
    return new FormGroup<ProductTransactionFormGroupContent>({
      id: new FormControl(
        { value: productTransactionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      refrenceId: new FormControl(productTransactionRawValue.refrenceId),
      transactionType: new FormControl(productTransactionRawValue.transactionType),
      transactionStatus: new FormControl(productTransactionRawValue.transactionStatus),
      transactionDate: new FormControl(productTransactionRawValue.transactionDate),
      description: new FormControl(productTransactionRawValue.description),
      freeField1: new FormControl(productTransactionRawValue.freeField1),
      freeField2: new FormControl(productTransactionRawValue.freeField2),
      lastModified: new FormControl(productTransactionRawValue.lastModified),
      lastModifiedBy: new FormControl(productTransactionRawValue.lastModifiedBy),
      securityUser: new FormControl(productTransactionRawValue.securityUser),
      wareHouse: new FormControl(productTransactionRawValue.wareHouse),
    });
  }

  getProductTransaction(form: ProductTransactionFormGroup): IProductTransaction | NewProductTransaction {
    return form.getRawValue() as IProductTransaction | NewProductTransaction;
  }

  resetForm(form: ProductTransactionFormGroup, productTransaction: ProductTransactionFormGroupInput): void {
    const productTransactionRawValue = { ...this.getFormDefaults(), ...productTransaction };
    form.reset(
      {
        ...productTransactionRawValue,
        id: { value: productTransactionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProductTransactionFormDefaults {
    return {
      id: null,
    };
  }
}
