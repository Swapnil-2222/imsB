import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPurchaseQuotationDetails, NewPurchaseQuotationDetails } from '../purchase-quotation-details.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPurchaseQuotationDetails for edit and NewPurchaseQuotationDetailsFormGroupInput for create.
 */
type PurchaseQuotationDetailsFormGroupInput = IPurchaseQuotationDetails | PartialWithRequiredKeyOf<NewPurchaseQuotationDetails>;

type PurchaseQuotationDetailsFormDefaults = Pick<NewPurchaseQuotationDetails, 'id'>;

type PurchaseQuotationDetailsFormGroupContent = {
  id: FormControl<IPurchaseQuotationDetails['id'] | NewPurchaseQuotationDetails['id']>;
  qtyordered: FormControl<IPurchaseQuotationDetails['qtyordered']>;
  gstTaxPercentage: FormControl<IPurchaseQuotationDetails['gstTaxPercentage']>;
  pricePerUnit: FormControl<IPurchaseQuotationDetails['pricePerUnit']>;
  totalPrice: FormControl<IPurchaseQuotationDetails['totalPrice']>;
  discount: FormControl<IPurchaseQuotationDetails['discount']>;
  lastModified: FormControl<IPurchaseQuotationDetails['lastModified']>;
  lastModifiedBy: FormControl<IPurchaseQuotationDetails['lastModifiedBy']>;
  freeField1: FormControl<IPurchaseQuotationDetails['freeField1']>;
  freeField2: FormControl<IPurchaseQuotationDetails['freeField2']>;
  purchaseQuotation: FormControl<IPurchaseQuotationDetails['purchaseQuotation']>;
};

export type PurchaseQuotationDetailsFormGroup = FormGroup<PurchaseQuotationDetailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PurchaseQuotationDetailsFormService {
  createPurchaseQuotationDetailsFormGroup(
    purchaseQuotationDetails: PurchaseQuotationDetailsFormGroupInput = { id: null }
  ): PurchaseQuotationDetailsFormGroup {
    const purchaseQuotationDetailsRawValue = {
      ...this.getFormDefaults(),
      ...purchaseQuotationDetails,
    };
    return new FormGroup<PurchaseQuotationDetailsFormGroupContent>({
      id: new FormControl(
        { value: purchaseQuotationDetailsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      qtyordered: new FormControl(purchaseQuotationDetailsRawValue.qtyordered),
      gstTaxPercentage: new FormControl(purchaseQuotationDetailsRawValue.gstTaxPercentage),
      pricePerUnit: new FormControl(purchaseQuotationDetailsRawValue.pricePerUnit),
      totalPrice: new FormControl(purchaseQuotationDetailsRawValue.totalPrice),
      discount: new FormControl(purchaseQuotationDetailsRawValue.discount),
      lastModified: new FormControl(purchaseQuotationDetailsRawValue.lastModified, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(purchaseQuotationDetailsRawValue.lastModifiedBy, {
        validators: [Validators.required],
      }),
      freeField1: new FormControl(purchaseQuotationDetailsRawValue.freeField1),
      freeField2: new FormControl(purchaseQuotationDetailsRawValue.freeField2),
      purchaseQuotation: new FormControl(purchaseQuotationDetailsRawValue.purchaseQuotation),
    });
  }

  getPurchaseQuotationDetails(form: PurchaseQuotationDetailsFormGroup): IPurchaseQuotationDetails | NewPurchaseQuotationDetails {
    return form.getRawValue() as IPurchaseQuotationDetails | NewPurchaseQuotationDetails;
  }

  resetForm(form: PurchaseQuotationDetailsFormGroup, purchaseQuotationDetails: PurchaseQuotationDetailsFormGroupInput): void {
    const purchaseQuotationDetailsRawValue = { ...this.getFormDefaults(), ...purchaseQuotationDetails };
    form.reset(
      {
        ...purchaseQuotationDetailsRawValue,
        id: { value: purchaseQuotationDetailsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PurchaseQuotationDetailsFormDefaults {
    return {
      id: null,
    };
  }
}
