import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITransferDetailsApprovals, NewTransferDetailsApprovals } from '../transfer-details-approvals.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITransferDetailsApprovals for edit and NewTransferDetailsApprovalsFormGroupInput for create.
 */
type TransferDetailsApprovalsFormGroupInput = ITransferDetailsApprovals | PartialWithRequiredKeyOf<NewTransferDetailsApprovals>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITransferDetailsApprovals | NewTransferDetailsApprovals> = Omit<T, 'approvalDate'> & {
  approvalDate?: string | null;
};

type TransferDetailsApprovalsFormRawValue = FormValueOf<ITransferDetailsApprovals>;

type NewTransferDetailsApprovalsFormRawValue = FormValueOf<NewTransferDetailsApprovals>;

type TransferDetailsApprovalsFormDefaults = Pick<NewTransferDetailsApprovals, 'id' | 'approvalDate' | 'isDeleted' | 'isActive'>;

type TransferDetailsApprovalsFormGroupContent = {
  id: FormControl<TransferDetailsApprovalsFormRawValue['id'] | NewTransferDetailsApprovals['id']>;
  approvalDate: FormControl<TransferDetailsApprovalsFormRawValue['approvalDate']>;
  qtyRequested: FormControl<TransferDetailsApprovalsFormRawValue['qtyRequested']>;
  qtyApproved: FormControl<TransferDetailsApprovalsFormRawValue['qtyApproved']>;
  comment: FormControl<TransferDetailsApprovalsFormRawValue['comment']>;
  freeField1: FormControl<TransferDetailsApprovalsFormRawValue['freeField1']>;
  lastModified: FormControl<TransferDetailsApprovalsFormRawValue['lastModified']>;
  lastModifiedBy: FormControl<TransferDetailsApprovalsFormRawValue['lastModifiedBy']>;
  isDeleted: FormControl<TransferDetailsApprovalsFormRawValue['isDeleted']>;
  isActive: FormControl<TransferDetailsApprovalsFormRawValue['isActive']>;
  securityUser: FormControl<TransferDetailsApprovalsFormRawValue['securityUser']>;
  transfer: FormControl<TransferDetailsApprovalsFormRawValue['transfer']>;
};

export type TransferDetailsApprovalsFormGroup = FormGroup<TransferDetailsApprovalsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TransferDetailsApprovalsFormService {
  createTransferDetailsApprovalsFormGroup(
    transferDetailsApprovals: TransferDetailsApprovalsFormGroupInput = { id: null }
  ): TransferDetailsApprovalsFormGroup {
    const transferDetailsApprovalsRawValue = this.convertTransferDetailsApprovalsToTransferDetailsApprovalsRawValue({
      ...this.getFormDefaults(),
      ...transferDetailsApprovals,
    });
    return new FormGroup<TransferDetailsApprovalsFormGroupContent>({
      id: new FormControl(
        { value: transferDetailsApprovalsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      approvalDate: new FormControl(transferDetailsApprovalsRawValue.approvalDate),
      qtyRequested: new FormControl(transferDetailsApprovalsRawValue.qtyRequested),
      qtyApproved: new FormControl(transferDetailsApprovalsRawValue.qtyApproved),
      comment: new FormControl(transferDetailsApprovalsRawValue.comment),
      freeField1: new FormControl(transferDetailsApprovalsRawValue.freeField1),
      lastModified: new FormControl(transferDetailsApprovalsRawValue.lastModified),
      lastModifiedBy: new FormControl(transferDetailsApprovalsRawValue.lastModifiedBy),
      isDeleted: new FormControl(transferDetailsApprovalsRawValue.isDeleted),
      isActive: new FormControl(transferDetailsApprovalsRawValue.isActive),
      securityUser: new FormControl(transferDetailsApprovalsRawValue.securityUser),
      transfer: new FormControl(transferDetailsApprovalsRawValue.transfer),
    });
  }

  getTransferDetailsApprovals(form: TransferDetailsApprovalsFormGroup): ITransferDetailsApprovals | NewTransferDetailsApprovals {
    return this.convertTransferDetailsApprovalsRawValueToTransferDetailsApprovals(
      form.getRawValue() as TransferDetailsApprovalsFormRawValue | NewTransferDetailsApprovalsFormRawValue
    );
  }

  resetForm(form: TransferDetailsApprovalsFormGroup, transferDetailsApprovals: TransferDetailsApprovalsFormGroupInput): void {
    const transferDetailsApprovalsRawValue = this.convertTransferDetailsApprovalsToTransferDetailsApprovalsRawValue({
      ...this.getFormDefaults(),
      ...transferDetailsApprovals,
    });
    form.reset(
      {
        ...transferDetailsApprovalsRawValue,
        id: { value: transferDetailsApprovalsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TransferDetailsApprovalsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      approvalDate: currentTime,
      isDeleted: false,
      isActive: false,
    };
  }

  private convertTransferDetailsApprovalsRawValueToTransferDetailsApprovals(
    rawTransferDetailsApprovals: TransferDetailsApprovalsFormRawValue | NewTransferDetailsApprovalsFormRawValue
  ): ITransferDetailsApprovals | NewTransferDetailsApprovals {
    return {
      ...rawTransferDetailsApprovals,
      approvalDate: dayjs(rawTransferDetailsApprovals.approvalDate, DATE_TIME_FORMAT),
    };
  }

  private convertTransferDetailsApprovalsToTransferDetailsApprovalsRawValue(
    transferDetailsApprovals: ITransferDetailsApprovals | (Partial<NewTransferDetailsApprovals> & TransferDetailsApprovalsFormDefaults)
  ): TransferDetailsApprovalsFormRawValue | PartialWithRequiredKeyOf<NewTransferDetailsApprovalsFormRawValue> {
    return {
      ...transferDetailsApprovals,
      approvalDate: transferDetailsApprovals.approvalDate ? transferDetailsApprovals.approvalDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
