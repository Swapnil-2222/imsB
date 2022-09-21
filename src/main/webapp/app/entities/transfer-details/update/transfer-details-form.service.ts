import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITransferDetails, NewTransferDetails } from '../transfer-details.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITransferDetails for edit and NewTransferDetailsFormGroupInput for create.
 */
type TransferDetailsFormGroupInput = ITransferDetails | PartialWithRequiredKeyOf<NewTransferDetails>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITransferDetails | NewTransferDetails> = Omit<T, 'approvalDate'> & {
  approvalDate?: string | null;
};

type TransferDetailsFormRawValue = FormValueOf<ITransferDetails>;

type NewTransferDetailsFormRawValue = FormValueOf<NewTransferDetails>;

type TransferDetailsFormDefaults = Pick<NewTransferDetails, 'id' | 'approvalDate' | 'isDeleted' | 'isActive'>;

type TransferDetailsFormGroupContent = {
  id: FormControl<TransferDetailsFormRawValue['id'] | NewTransferDetails['id']>;
  approvalDate: FormControl<TransferDetailsFormRawValue['approvalDate']>;
  qty: FormControl<TransferDetailsFormRawValue['qty']>;
  comment: FormControl<TransferDetailsFormRawValue['comment']>;
  freeField1: FormControl<TransferDetailsFormRawValue['freeField1']>;
  freeField2: FormControl<TransferDetailsFormRawValue['freeField2']>;
  lastModified: FormControl<TransferDetailsFormRawValue['lastModified']>;
  lastModifiedBy: FormControl<TransferDetailsFormRawValue['lastModifiedBy']>;
  isDeleted: FormControl<TransferDetailsFormRawValue['isDeleted']>;
  isActive: FormControl<TransferDetailsFormRawValue['isActive']>;
  wareHouse: FormControl<TransferDetailsFormRawValue['wareHouse']>;
  product: FormControl<TransferDetailsFormRawValue['product']>;
  transfer: FormControl<TransferDetailsFormRawValue['transfer']>;
};

export type TransferDetailsFormGroup = FormGroup<TransferDetailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TransferDetailsFormService {
  createTransferDetailsFormGroup(transferDetails: TransferDetailsFormGroupInput = { id: null }): TransferDetailsFormGroup {
    const transferDetailsRawValue = this.convertTransferDetailsToTransferDetailsRawValue({
      ...this.getFormDefaults(),
      ...transferDetails,
    });
    return new FormGroup<TransferDetailsFormGroupContent>({
      id: new FormControl(
        { value: transferDetailsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      approvalDate: new FormControl(transferDetailsRawValue.approvalDate),
      qty: new FormControl(transferDetailsRawValue.qty),
      comment: new FormControl(transferDetailsRawValue.comment),
      freeField1: new FormControl(transferDetailsRawValue.freeField1),
      freeField2: new FormControl(transferDetailsRawValue.freeField2),
      lastModified: new FormControl(transferDetailsRawValue.lastModified),
      lastModifiedBy: new FormControl(transferDetailsRawValue.lastModifiedBy),
      isDeleted: new FormControl(transferDetailsRawValue.isDeleted),
      isActive: new FormControl(transferDetailsRawValue.isActive),
      wareHouse: new FormControl(transferDetailsRawValue.wareHouse),
      product: new FormControl(transferDetailsRawValue.product),
      transfer: new FormControl(transferDetailsRawValue.transfer),
    });
  }

  getTransferDetails(form: TransferDetailsFormGroup): ITransferDetails | NewTransferDetails {
    return this.convertTransferDetailsRawValueToTransferDetails(
      form.getRawValue() as TransferDetailsFormRawValue | NewTransferDetailsFormRawValue
    );
  }

  resetForm(form: TransferDetailsFormGroup, transferDetails: TransferDetailsFormGroupInput): void {
    const transferDetailsRawValue = this.convertTransferDetailsToTransferDetailsRawValue({ ...this.getFormDefaults(), ...transferDetails });
    form.reset(
      {
        ...transferDetailsRawValue,
        id: { value: transferDetailsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TransferDetailsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      approvalDate: currentTime,
      isDeleted: false,
      isActive: false,
    };
  }

  private convertTransferDetailsRawValueToTransferDetails(
    rawTransferDetails: TransferDetailsFormRawValue | NewTransferDetailsFormRawValue
  ): ITransferDetails | NewTransferDetails {
    return {
      ...rawTransferDetails,
      approvalDate: dayjs(rawTransferDetails.approvalDate, DATE_TIME_FORMAT),
    };
  }

  private convertTransferDetailsToTransferDetailsRawValue(
    transferDetails: ITransferDetails | (Partial<NewTransferDetails> & TransferDetailsFormDefaults)
  ): TransferDetailsFormRawValue | PartialWithRequiredKeyOf<NewTransferDetailsFormRawValue> {
    return {
      ...transferDetails,
      approvalDate: transferDetails.approvalDate ? transferDetails.approvalDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
