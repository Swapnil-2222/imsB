import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../product.test-samples';

import { ProductFormService } from './product-form.service';

describe('Product Form Service', () => {
  let service: ProductFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductFormService);
  });

  describe('Service methods', () => {
    describe('createProductFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            shortName: expect.any(Object),
            chemicalFormula: expect.any(Object),
            hsnNo: expect.any(Object),
            materialImage: expect.any(Object),
            isDeleted: expect.any(Object),
            isActive: expect.any(Object),
            productName: expect.any(Object),
            alertUnits: expect.any(Object),
            casNumber: expect.any(Object),
            catlogNumber: expect.any(Object),
            molecularWt: expect.any(Object),
            molecularFormula: expect.any(Object),
            chemicalName: expect.any(Object),
            structureImg: expect.any(Object),
            description: expect.any(Object),
            qrCode: expect.any(Object),
            barCode: expect.any(Object),
            gstPercentage: expect.any(Object),
            productType: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            categories: expect.any(Object),
            unit: expect.any(Object),
            securityUser: expect.any(Object),
            purchaseQuotationDetails: expect.any(Object),
          })
        );
      });

      it('passing IProduct should create a new form with FormGroup', () => {
        const formGroup = service.createProductFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            shortName: expect.any(Object),
            chemicalFormula: expect.any(Object),
            hsnNo: expect.any(Object),
            materialImage: expect.any(Object),
            isDeleted: expect.any(Object),
            isActive: expect.any(Object),
            productName: expect.any(Object),
            alertUnits: expect.any(Object),
            casNumber: expect.any(Object),
            catlogNumber: expect.any(Object),
            molecularWt: expect.any(Object),
            molecularFormula: expect.any(Object),
            chemicalName: expect.any(Object),
            structureImg: expect.any(Object),
            description: expect.any(Object),
            qrCode: expect.any(Object),
            barCode: expect.any(Object),
            gstPercentage: expect.any(Object),
            productType: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            categories: expect.any(Object),
            unit: expect.any(Object),
            securityUser: expect.any(Object),
            purchaseQuotationDetails: expect.any(Object),
          })
        );
      });
    });

    describe('getProduct', () => {
      it('should return NewProduct for default Product initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProductFormGroup(sampleWithNewData);

        const product = service.getProduct(formGroup) as any;

        expect(product).toMatchObject(sampleWithNewData);
      });

      it('should return NewProduct for empty Product initial value', () => {
        const formGroup = service.createProductFormGroup();

        const product = service.getProduct(formGroup) as any;

        expect(product).toMatchObject({});
      });

      it('should return IProduct', () => {
        const formGroup = service.createProductFormGroup(sampleWithRequiredData);

        const product = service.getProduct(formGroup) as any;

        expect(product).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProduct should not enable id FormControl', () => {
        const formGroup = service.createProductFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProduct should disable id FormControl', () => {
        const formGroup = service.createProductFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
