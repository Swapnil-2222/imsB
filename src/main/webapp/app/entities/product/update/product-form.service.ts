import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProduct, NewProduct } from '../product.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProduct for edit and NewProductFormGroupInput for create.
 */
type ProductFormGroupInput = IProduct | PartialWithRequiredKeyOf<NewProduct>;

type ProductFormDefaults = Pick<NewProduct, 'id' | 'isDeleted' | 'isActive'>;

type ProductFormGroupContent = {
  id: FormControl<IProduct['id'] | NewProduct['id']>;
  shortName: FormControl<IProduct['shortName']>;
  chemicalFormula: FormControl<IProduct['chemicalFormula']>;
  hsnNo: FormControl<IProduct['hsnNo']>;
  materialImage: FormControl<IProduct['materialImage']>;
  materialImageContentType: FormControl<IProduct['materialImageContentType']>;
  isDeleted: FormControl<IProduct['isDeleted']>;
  isActive: FormControl<IProduct['isActive']>;
  productName: FormControl<IProduct['productName']>;
  alertUnits: FormControl<IProduct['alertUnits']>;
  casNumber: FormControl<IProduct['casNumber']>;
  catlogNumber: FormControl<IProduct['catlogNumber']>;
  molecularWt: FormControl<IProduct['molecularWt']>;
  molecularFormula: FormControl<IProduct['molecularFormula']>;
  chemicalName: FormControl<IProduct['chemicalName']>;
  structureImg: FormControl<IProduct['structureImg']>;
  description: FormControl<IProduct['description']>;
  qrCode: FormControl<IProduct['qrCode']>;
  barCode: FormControl<IProduct['barCode']>;
  gstPercentage: FormControl<IProduct['gstPercentage']>;
  productType: FormControl<IProduct['productType']>;
  lastModified: FormControl<IProduct['lastModified']>;
  lastModifiedBy: FormControl<IProduct['lastModifiedBy']>;
  freeField1: FormControl<IProduct['freeField1']>;
  freeField2: FormControl<IProduct['freeField2']>;
  categories: FormControl<IProduct['categories']>;
  unit: FormControl<IProduct['unit']>;
  securityUser: FormControl<IProduct['securityUser']>;
  purchaseQuotationDetails: FormControl<IProduct['purchaseQuotationDetails']>;
};

export type ProductFormGroup = FormGroup<ProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  createProductFormGroup(product: ProductFormGroupInput = { id: null }): ProductFormGroup {
    const productRawValue = {
      ...this.getFormDefaults(),
      ...product,
    };
    return new FormGroup<ProductFormGroupContent>({
      id: new FormControl(
        { value: productRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      shortName: new FormControl(productRawValue.shortName),
      chemicalFormula: new FormControl(productRawValue.chemicalFormula),
      hsnNo: new FormControl(productRawValue.hsnNo),
      materialImage: new FormControl(productRawValue.materialImage),
      materialImageContentType: new FormControl(productRawValue.materialImageContentType),
      isDeleted: new FormControl(productRawValue.isDeleted),
      isActive: new FormControl(productRawValue.isActive),
      productName: new FormControl(productRawValue.productName),
      alertUnits: new FormControl(productRawValue.alertUnits),
      casNumber: new FormControl(productRawValue.casNumber),
      catlogNumber: new FormControl(productRawValue.catlogNumber),
      molecularWt: new FormControl(productRawValue.molecularWt),
      molecularFormula: new FormControl(productRawValue.molecularFormula),
      chemicalName: new FormControl(productRawValue.chemicalName),
      structureImg: new FormControl(productRawValue.structureImg),
      description: new FormControl(productRawValue.description),
      qrCode: new FormControl(productRawValue.qrCode),
      barCode: new FormControl(productRawValue.barCode),
      gstPercentage: new FormControl(productRawValue.gstPercentage),
      productType: new FormControl(productRawValue.productType),
      lastModified: new FormControl(productRawValue.lastModified),
      lastModifiedBy: new FormControl(productRawValue.lastModifiedBy),
      freeField1: new FormControl(productRawValue.freeField1),
      freeField2: new FormControl(productRawValue.freeField2),
      categories: new FormControl(productRawValue.categories),
      unit: new FormControl(productRawValue.unit),
      securityUser: new FormControl(productRawValue.securityUser),
      purchaseQuotationDetails: new FormControl(productRawValue.purchaseQuotationDetails),
    });
  }

  getProduct(form: ProductFormGroup): IProduct | NewProduct {
    return form.getRawValue() as IProduct | NewProduct;
  }

  resetForm(form: ProductFormGroup, product: ProductFormGroupInput): void {
    const productRawValue = { ...this.getFormDefaults(), ...product };
    form.reset(
      {
        ...productRawValue,
        id: { value: productRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProductFormDefaults {
    return {
      id: null,
      isDeleted: false,
      isActive: false,
    };
  }
}
