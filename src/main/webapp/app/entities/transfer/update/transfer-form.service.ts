import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITransfer, NewTransfer } from '../transfer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITransfer for edit and NewTransferFormGroupInput for create.
 */
type TransferFormGroupInput = ITransfer | PartialWithRequiredKeyOf<NewTransfer>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITransfer | NewTransfer> = Omit<T, 'tranferDate'> & {
  tranferDate?: string | null;
};

type TransferFormRawValue = FormValueOf<ITransfer>;

type NewTransferFormRawValue = FormValueOf<NewTransfer>;

type TransferFormDefaults = Pick<NewTransfer, 'id' | 'tranferDate'>;

type TransferFormGroupContent = {
  id: FormControl<TransferFormRawValue['id'] | NewTransfer['id']>;
  tranferDate: FormControl<TransferFormRawValue['tranferDate']>;
  comment: FormControl<TransferFormRawValue['comment']>;
  status: FormControl<TransferFormRawValue['status']>;
  sourceWareHouse: FormControl<TransferFormRawValue['sourceWareHouse']>;
  destinationWareHouse: FormControl<TransferFormRawValue['destinationWareHouse']>;
  freeField1: FormControl<TransferFormRawValue['freeField1']>;
  lastModified: FormControl<TransferFormRawValue['lastModified']>;
  lastModifiedBy: FormControl<TransferFormRawValue['lastModifiedBy']>;
  securityUser: FormControl<TransferFormRawValue['securityUser']>;
  wareHouse: FormControl<TransferFormRawValue['wareHouse']>;
};

export type TransferFormGroup = FormGroup<TransferFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TransferFormService {
  createTransferFormGroup(transfer: TransferFormGroupInput = { id: null }): TransferFormGroup {
    const transferRawValue = this.convertTransferToTransferRawValue({
      ...this.getFormDefaults(),
      ...transfer,
    });
    return new FormGroup<TransferFormGroupContent>({
      id: new FormControl(
        { value: transferRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      tranferDate: new FormControl(transferRawValue.tranferDate),
      comment: new FormControl(transferRawValue.comment),
      status: new FormControl(transferRawValue.status),
      sourceWareHouse: new FormControl(transferRawValue.sourceWareHouse),
      destinationWareHouse: new FormControl(transferRawValue.destinationWareHouse),
      freeField1: new FormControl(transferRawValue.freeField1),
      lastModified: new FormControl(transferRawValue.lastModified),
      lastModifiedBy: new FormControl(transferRawValue.lastModifiedBy),
      securityUser: new FormControl(transferRawValue.securityUser),
      wareHouse: new FormControl(transferRawValue.wareHouse),
    });
  }

  getTransfer(form: TransferFormGroup): ITransfer | NewTransfer {
    return this.convertTransferRawValueToTransfer(form.getRawValue() as TransferFormRawValue | NewTransferFormRawValue);
  }

  resetForm(form: TransferFormGroup, transfer: TransferFormGroupInput): void {
    const transferRawValue = this.convertTransferToTransferRawValue({ ...this.getFormDefaults(), ...transfer });
    form.reset(
      {
        ...transferRawValue,
        id: { value: transferRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TransferFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      tranferDate: currentTime,
    };
  }

  private convertTransferRawValueToTransfer(rawTransfer: TransferFormRawValue | NewTransferFormRawValue): ITransfer | NewTransfer {
    return {
      ...rawTransfer,
      tranferDate: dayjs(rawTransfer.tranferDate, DATE_TIME_FORMAT),
    };
  }

  private convertTransferToTransferRawValue(
    transfer: ITransfer | (Partial<NewTransfer> & TransferFormDefaults)
  ): TransferFormRawValue | PartialWithRequiredKeyOf<NewTransferFormRawValue> {
    return {
      ...transfer,
      tranferDate: transfer.tranferDate ? transfer.tranferDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
