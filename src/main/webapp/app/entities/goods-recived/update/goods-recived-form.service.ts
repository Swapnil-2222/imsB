import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGoodsRecived, NewGoodsRecived } from '../goods-recived.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGoodsRecived for edit and NewGoodsRecivedFormGroupInput for create.
 */
type GoodsRecivedFormGroupInput = IGoodsRecived | PartialWithRequiredKeyOf<NewGoodsRecived>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGoodsRecived | NewGoodsRecived> = Omit<T, 'grDate' | 'manufacturingDate' | 'expiryDate'> & {
  grDate?: string | null;
  manufacturingDate?: string | null;
  expiryDate?: string | null;
};

type GoodsRecivedFormRawValue = FormValueOf<IGoodsRecived>;

type NewGoodsRecivedFormRawValue = FormValueOf<NewGoodsRecived>;

type GoodsRecivedFormDefaults = Pick<NewGoodsRecived, 'id' | 'grDate' | 'manufacturingDate' | 'expiryDate'>;

type GoodsRecivedFormGroupContent = {
  id: FormControl<GoodsRecivedFormRawValue['id'] | NewGoodsRecived['id']>;
  grDate: FormControl<GoodsRecivedFormRawValue['grDate']>;
  qtyOrdered: FormControl<GoodsRecivedFormRawValue['qtyOrdered']>;
  qtyRecieved: FormControl<GoodsRecivedFormRawValue['qtyRecieved']>;
  manufacturingDate: FormControl<GoodsRecivedFormRawValue['manufacturingDate']>;
  expiryDate: FormControl<GoodsRecivedFormRawValue['expiryDate']>;
  lotNo: FormControl<GoodsRecivedFormRawValue['lotNo']>;
  freeField1: FormControl<GoodsRecivedFormRawValue['freeField1']>;
  freeField2: FormControl<GoodsRecivedFormRawValue['freeField2']>;
  freeField3: FormControl<GoodsRecivedFormRawValue['freeField3']>;
  purchaseQuotation: FormControl<GoodsRecivedFormRawValue['purchaseQuotation']>;
};

export type GoodsRecivedFormGroup = FormGroup<GoodsRecivedFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GoodsRecivedFormService {
  createGoodsRecivedFormGroup(goodsRecived: GoodsRecivedFormGroupInput = { id: null }): GoodsRecivedFormGroup {
    const goodsRecivedRawValue = this.convertGoodsRecivedToGoodsRecivedRawValue({
      ...this.getFormDefaults(),
      ...goodsRecived,
    });
    return new FormGroup<GoodsRecivedFormGroupContent>({
      id: new FormControl(
        { value: goodsRecivedRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      grDate: new FormControl(goodsRecivedRawValue.grDate),
      qtyOrdered: new FormControl(goodsRecivedRawValue.qtyOrdered),
      qtyRecieved: new FormControl(goodsRecivedRawValue.qtyRecieved),
      manufacturingDate: new FormControl(goodsRecivedRawValue.manufacturingDate),
      expiryDate: new FormControl(goodsRecivedRawValue.expiryDate),
      lotNo: new FormControl(goodsRecivedRawValue.lotNo),
      freeField1: new FormControl(goodsRecivedRawValue.freeField1),
      freeField2: new FormControl(goodsRecivedRawValue.freeField2),
      freeField3: new FormControl(goodsRecivedRawValue.freeField3),
      purchaseQuotation: new FormControl(goodsRecivedRawValue.purchaseQuotation),
    });
  }

  getGoodsRecived(form: GoodsRecivedFormGroup): IGoodsRecived | NewGoodsRecived {
    return this.convertGoodsRecivedRawValueToGoodsRecived(form.getRawValue() as GoodsRecivedFormRawValue | NewGoodsRecivedFormRawValue);
  }

  resetForm(form: GoodsRecivedFormGroup, goodsRecived: GoodsRecivedFormGroupInput): void {
    const goodsRecivedRawValue = this.convertGoodsRecivedToGoodsRecivedRawValue({ ...this.getFormDefaults(), ...goodsRecived });
    form.reset(
      {
        ...goodsRecivedRawValue,
        id: { value: goodsRecivedRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GoodsRecivedFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      grDate: currentTime,
      manufacturingDate: currentTime,
      expiryDate: currentTime,
    };
  }

  private convertGoodsRecivedRawValueToGoodsRecived(
    rawGoodsRecived: GoodsRecivedFormRawValue | NewGoodsRecivedFormRawValue
  ): IGoodsRecived | NewGoodsRecived {
    return {
      ...rawGoodsRecived,
      grDate: dayjs(rawGoodsRecived.grDate, DATE_TIME_FORMAT),
      manufacturingDate: dayjs(rawGoodsRecived.manufacturingDate, DATE_TIME_FORMAT),
      expiryDate: dayjs(rawGoodsRecived.expiryDate, DATE_TIME_FORMAT),
    };
  }

  private convertGoodsRecivedToGoodsRecivedRawValue(
    goodsRecived: IGoodsRecived | (Partial<NewGoodsRecived> & GoodsRecivedFormDefaults)
  ): GoodsRecivedFormRawValue | PartialWithRequiredKeyOf<NewGoodsRecivedFormRawValue> {
    return {
      ...goodsRecived,
      grDate: goodsRecived.grDate ? goodsRecived.grDate.format(DATE_TIME_FORMAT) : undefined,
      manufacturingDate: goodsRecived.manufacturingDate ? goodsRecived.manufacturingDate.format(DATE_TIME_FORMAT) : undefined,
      expiryDate: goodsRecived.expiryDate ? goodsRecived.expiryDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
