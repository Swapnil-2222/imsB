import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITransferRecieved, NewTransferRecieved } from '../transfer-recieved.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITransferRecieved for edit and NewTransferRecievedFormGroupInput for create.
 */
type TransferRecievedFormGroupInput = ITransferRecieved | PartialWithRequiredKeyOf<NewTransferRecieved>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITransferRecieved | NewTransferRecieved> = Omit<T, 'transferDate'> & {
  transferDate?: string | null;
};

type TransferRecievedFormRawValue = FormValueOf<ITransferRecieved>;

type NewTransferRecievedFormRawValue = FormValueOf<NewTransferRecieved>;

type TransferRecievedFormDefaults = Pick<NewTransferRecieved, 'id' | 'transferDate' | 'isDeleted' | 'isActive'>;

type TransferRecievedFormGroupContent = {
  id: FormControl<TransferRecievedFormRawValue['id'] | NewTransferRecieved['id']>;
  transferDate: FormControl<TransferRecievedFormRawValue['transferDate']>;
  qtyTransfered: FormControl<TransferRecievedFormRawValue['qtyTransfered']>;
  qtyReceived: FormControl<TransferRecievedFormRawValue['qtyReceived']>;
  comment: FormControl<TransferRecievedFormRawValue['comment']>;
  freeField1: FormControl<TransferRecievedFormRawValue['freeField1']>;
  lastModified: FormControl<TransferRecievedFormRawValue['lastModified']>;
  lastModifiedBy: FormControl<TransferRecievedFormRawValue['lastModifiedBy']>;
  isDeleted: FormControl<TransferRecievedFormRawValue['isDeleted']>;
  isActive: FormControl<TransferRecievedFormRawValue['isActive']>;
  securityUser: FormControl<TransferRecievedFormRawValue['securityUser']>;
  transfer: FormControl<TransferRecievedFormRawValue['transfer']>;
};

export type TransferRecievedFormGroup = FormGroup<TransferRecievedFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TransferRecievedFormService {
  createTransferRecievedFormGroup(transferRecieved: TransferRecievedFormGroupInput = { id: null }): TransferRecievedFormGroup {
    const transferRecievedRawValue = this.convertTransferRecievedToTransferRecievedRawValue({
      ...this.getFormDefaults(),
      ...transferRecieved,
    });
    return new FormGroup<TransferRecievedFormGroupContent>({
      id: new FormControl(
        { value: transferRecievedRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      transferDate: new FormControl(transferRecievedRawValue.transferDate),
      qtyTransfered: new FormControl(transferRecievedRawValue.qtyTransfered),
      qtyReceived: new FormControl(transferRecievedRawValue.qtyReceived),
      comment: new FormControl(transferRecievedRawValue.comment),
      freeField1: new FormControl(transferRecievedRawValue.freeField1),
      lastModified: new FormControl(transferRecievedRawValue.lastModified),
      lastModifiedBy: new FormControl(transferRecievedRawValue.lastModifiedBy),
      isDeleted: new FormControl(transferRecievedRawValue.isDeleted),
      isActive: new FormControl(transferRecievedRawValue.isActive),
      securityUser: new FormControl(transferRecievedRawValue.securityUser),
      transfer: new FormControl(transferRecievedRawValue.transfer),
    });
  }

  getTransferRecieved(form: TransferRecievedFormGroup): ITransferRecieved | NewTransferRecieved {
    return this.convertTransferRecievedRawValueToTransferRecieved(
      form.getRawValue() as TransferRecievedFormRawValue | NewTransferRecievedFormRawValue
    );
  }

  resetForm(form: TransferRecievedFormGroup, transferRecieved: TransferRecievedFormGroupInput): void {
    const transferRecievedRawValue = this.convertTransferRecievedToTransferRecievedRawValue({
      ...this.getFormDefaults(),
      ...transferRecieved,
    });
    form.reset(
      {
        ...transferRecievedRawValue,
        id: { value: transferRecievedRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TransferRecievedFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      transferDate: currentTime,
      isDeleted: false,
      isActive: false,
    };
  }

  private convertTransferRecievedRawValueToTransferRecieved(
    rawTransferRecieved: TransferRecievedFormRawValue | NewTransferRecievedFormRawValue
  ): ITransferRecieved | NewTransferRecieved {
    return {
      ...rawTransferRecieved,
      transferDate: dayjs(rawTransferRecieved.transferDate, DATE_TIME_FORMAT),
    };
  }

  private convertTransferRecievedToTransferRecievedRawValue(
    transferRecieved: ITransferRecieved | (Partial<NewTransferRecieved> & TransferRecievedFormDefaults)
  ): TransferRecievedFormRawValue | PartialWithRequiredKeyOf<NewTransferRecievedFormRawValue> {
    return {
      ...transferRecieved,
      transferDate: transferRecieved.transferDate ? transferRecieved.transferDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
