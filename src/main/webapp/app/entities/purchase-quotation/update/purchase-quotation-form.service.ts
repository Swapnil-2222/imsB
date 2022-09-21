import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPurchaseQuotation, NewPurchaseQuotation } from '../purchase-quotation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPurchaseQuotation for edit and NewPurchaseQuotationFormGroupInput for create.
 */
type PurchaseQuotationFormGroupInput = IPurchaseQuotation | PartialWithRequiredKeyOf<NewPurchaseQuotation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPurchaseQuotation | NewPurchaseQuotation> = Omit<T, 'expectedDeliveryDate' | 'poDate'> & {
  expectedDeliveryDate?: string | null;
  poDate?: string | null;
};

type PurchaseQuotationFormRawValue = FormValueOf<IPurchaseQuotation>;

type NewPurchaseQuotationFormRawValue = FormValueOf<NewPurchaseQuotation>;

type PurchaseQuotationFormDefaults = Pick<NewPurchaseQuotation, 'id' | 'expectedDeliveryDate' | 'poDate'>;

type PurchaseQuotationFormGroupContent = {
  id: FormControl<PurchaseQuotationFormRawValue['id'] | NewPurchaseQuotation['id']>;
  totalPOAmount: FormControl<PurchaseQuotationFormRawValue['totalPOAmount']>;
  totalGSTAmount: FormControl<PurchaseQuotationFormRawValue['totalGSTAmount']>;
  expectedDeliveryDate: FormControl<PurchaseQuotationFormRawValue['expectedDeliveryDate']>;
  poDate: FormControl<PurchaseQuotationFormRawValue['poDate']>;
  orderType: FormControl<PurchaseQuotationFormRawValue['orderType']>;
  orderStatus: FormControl<PurchaseQuotationFormRawValue['orderStatus']>;
  clientName: FormControl<PurchaseQuotationFormRawValue['clientName']>;
  clientMobile: FormControl<PurchaseQuotationFormRawValue['clientMobile']>;
  clientEmail: FormControl<PurchaseQuotationFormRawValue['clientEmail']>;
  termsAndCondition: FormControl<PurchaseQuotationFormRawValue['termsAndCondition']>;
  notes: FormControl<PurchaseQuotationFormRawValue['notes']>;
  lastModified: FormControl<PurchaseQuotationFormRawValue['lastModified']>;
  lastModifiedBy: FormControl<PurchaseQuotationFormRawValue['lastModifiedBy']>;
  freeField1: FormControl<PurchaseQuotationFormRawValue['freeField1']>;
  freeField2: FormControl<PurchaseQuotationFormRawValue['freeField2']>;
  securityUser: FormControl<PurchaseQuotationFormRawValue['securityUser']>;
};

export type PurchaseQuotationFormGroup = FormGroup<PurchaseQuotationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PurchaseQuotationFormService {
  createPurchaseQuotationFormGroup(purchaseQuotation: PurchaseQuotationFormGroupInput = { id: null }): PurchaseQuotationFormGroup {
    const purchaseQuotationRawValue = this.convertPurchaseQuotationToPurchaseQuotationRawValue({
      ...this.getFormDefaults(),
      ...purchaseQuotation,
    });
    return new FormGroup<PurchaseQuotationFormGroupContent>({
      id: new FormControl(
        { value: purchaseQuotationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      totalPOAmount: new FormControl(purchaseQuotationRawValue.totalPOAmount),
      totalGSTAmount: new FormControl(purchaseQuotationRawValue.totalGSTAmount),
      expectedDeliveryDate: new FormControl(purchaseQuotationRawValue.expectedDeliveryDate),
      poDate: new FormControl(purchaseQuotationRawValue.poDate),
      orderType: new FormControl(purchaseQuotationRawValue.orderType),
      orderStatus: new FormControl(purchaseQuotationRawValue.orderStatus),
      clientName: new FormControl(purchaseQuotationRawValue.clientName),
      clientMobile: new FormControl(purchaseQuotationRawValue.clientMobile),
      clientEmail: new FormControl(purchaseQuotationRawValue.clientEmail),
      termsAndCondition: new FormControl(purchaseQuotationRawValue.termsAndCondition),
      notes: new FormControl(purchaseQuotationRawValue.notes),
      lastModified: new FormControl(purchaseQuotationRawValue.lastModified, {
        validators: [Validators.required],
      }),
      lastModifiedBy: new FormControl(purchaseQuotationRawValue.lastModifiedBy, {
        validators: [Validators.required],
      }),
      freeField1: new FormControl(purchaseQuotationRawValue.freeField1),
      freeField2: new FormControl(purchaseQuotationRawValue.freeField2),
      securityUser: new FormControl(purchaseQuotationRawValue.securityUser),
    });
  }

  getPurchaseQuotation(form: PurchaseQuotationFormGroup): IPurchaseQuotation | NewPurchaseQuotation {
    return this.convertPurchaseQuotationRawValueToPurchaseQuotation(
      form.getRawValue() as PurchaseQuotationFormRawValue | NewPurchaseQuotationFormRawValue
    );
  }

  resetForm(form: PurchaseQuotationFormGroup, purchaseQuotation: PurchaseQuotationFormGroupInput): void {
    const purchaseQuotationRawValue = this.convertPurchaseQuotationToPurchaseQuotationRawValue({
      ...this.getFormDefaults(),
      ...purchaseQuotation,
    });
    form.reset(
      {
        ...purchaseQuotationRawValue,
        id: { value: purchaseQuotationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PurchaseQuotationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      expectedDeliveryDate: currentTime,
      poDate: currentTime,
    };
  }

  private convertPurchaseQuotationRawValueToPurchaseQuotation(
    rawPurchaseQuotation: PurchaseQuotationFormRawValue | NewPurchaseQuotationFormRawValue
  ): IPurchaseQuotation | NewPurchaseQuotation {
    return {
      ...rawPurchaseQuotation,
      expectedDeliveryDate: dayjs(rawPurchaseQuotation.expectedDeliveryDate, DATE_TIME_FORMAT),
      poDate: dayjs(rawPurchaseQuotation.poDate, DATE_TIME_FORMAT),
    };
  }

  private convertPurchaseQuotationToPurchaseQuotationRawValue(
    purchaseQuotation: IPurchaseQuotation | (Partial<NewPurchaseQuotation> & PurchaseQuotationFormDefaults)
  ): PurchaseQuotationFormRawValue | PartialWithRequiredKeyOf<NewPurchaseQuotationFormRawValue> {
    return {
      ...purchaseQuotation,
      expectedDeliveryDate: purchaseQuotation.expectedDeliveryDate
        ? purchaseQuotation.expectedDeliveryDate.format(DATE_TIME_FORMAT)
        : undefined,
      poDate: purchaseQuotation.poDate ? purchaseQuotation.poDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
