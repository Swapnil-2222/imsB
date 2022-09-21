import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IConsumptionDetails, NewConsumptionDetails } from '../consumption-details.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConsumptionDetails for edit and NewConsumptionDetailsFormGroupInput for create.
 */
type ConsumptionDetailsFormGroupInput = IConsumptionDetails | PartialWithRequiredKeyOf<NewConsumptionDetails>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IConsumptionDetails | NewConsumptionDetails> = Omit<T, 'comsumptionDate'> & {
  comsumptionDate?: string | null;
};

type ConsumptionDetailsFormRawValue = FormValueOf<IConsumptionDetails>;

type NewConsumptionDetailsFormRawValue = FormValueOf<NewConsumptionDetails>;

type ConsumptionDetailsFormDefaults = Pick<NewConsumptionDetails, 'id' | 'comsumptionDate'>;

type ConsumptionDetailsFormGroupContent = {
  id: FormControl<ConsumptionDetailsFormRawValue['id'] | NewConsumptionDetails['id']>;
  comsumptionDate: FormControl<ConsumptionDetailsFormRawValue['comsumptionDate']>;
  qtyConsumed: FormControl<ConsumptionDetailsFormRawValue['qtyConsumed']>;
  freeField1: FormControl<ConsumptionDetailsFormRawValue['freeField1']>;
  freeField2: FormControl<ConsumptionDetailsFormRawValue['freeField2']>;
  lastModified: FormControl<ConsumptionDetailsFormRawValue['lastModified']>;
  lastModifiedBy: FormControl<ConsumptionDetailsFormRawValue['lastModifiedBy']>;
  securityUser: FormControl<ConsumptionDetailsFormRawValue['securityUser']>;
  project: FormControl<ConsumptionDetailsFormRawValue['project']>;
  productInventory: FormControl<ConsumptionDetailsFormRawValue['productInventory']>;
};

export type ConsumptionDetailsFormGroup = FormGroup<ConsumptionDetailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConsumptionDetailsFormService {
  createConsumptionDetailsFormGroup(consumptionDetails: ConsumptionDetailsFormGroupInput = { id: null }): ConsumptionDetailsFormGroup {
    const consumptionDetailsRawValue = this.convertConsumptionDetailsToConsumptionDetailsRawValue({
      ...this.getFormDefaults(),
      ...consumptionDetails,
    });
    return new FormGroup<ConsumptionDetailsFormGroupContent>({
      id: new FormControl(
        { value: consumptionDetailsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      comsumptionDate: new FormControl(consumptionDetailsRawValue.comsumptionDate),
      qtyConsumed: new FormControl(consumptionDetailsRawValue.qtyConsumed),
      freeField1: new FormControl(consumptionDetailsRawValue.freeField1),
      freeField2: new FormControl(consumptionDetailsRawValue.freeField2),
      lastModified: new FormControl(consumptionDetailsRawValue.lastModified),
      lastModifiedBy: new FormControl(consumptionDetailsRawValue.lastModifiedBy),
      securityUser: new FormControl(consumptionDetailsRawValue.securityUser),
      project: new FormControl(consumptionDetailsRawValue.project),
      productInventory: new FormControl(consumptionDetailsRawValue.productInventory),
    });
  }

  getConsumptionDetails(form: ConsumptionDetailsFormGroup): IConsumptionDetails | NewConsumptionDetails {
    return this.convertConsumptionDetailsRawValueToConsumptionDetails(
      form.getRawValue() as ConsumptionDetailsFormRawValue | NewConsumptionDetailsFormRawValue
    );
  }

  resetForm(form: ConsumptionDetailsFormGroup, consumptionDetails: ConsumptionDetailsFormGroupInput): void {
    const consumptionDetailsRawValue = this.convertConsumptionDetailsToConsumptionDetailsRawValue({
      ...this.getFormDefaults(),
      ...consumptionDetails,
    });
    form.reset(
      {
        ...consumptionDetailsRawValue,
        id: { value: consumptionDetailsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ConsumptionDetailsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      comsumptionDate: currentTime,
    };
  }

  private convertConsumptionDetailsRawValueToConsumptionDetails(
    rawConsumptionDetails: ConsumptionDetailsFormRawValue | NewConsumptionDetailsFormRawValue
  ): IConsumptionDetails | NewConsumptionDetails {
    return {
      ...rawConsumptionDetails,
      comsumptionDate: dayjs(rawConsumptionDetails.comsumptionDate, DATE_TIME_FORMAT),
    };
  }

  private convertConsumptionDetailsToConsumptionDetailsRawValue(
    consumptionDetails: IConsumptionDetails | (Partial<NewConsumptionDetails> & ConsumptionDetailsFormDefaults)
  ): ConsumptionDetailsFormRawValue | PartialWithRequiredKeyOf<NewConsumptionDetailsFormRawValue> {
    return {
      ...consumptionDetails,
      comsumptionDate: consumptionDetails.comsumptionDate ? consumptionDetails.comsumptionDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
