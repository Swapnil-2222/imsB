import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../product-transaction.test-samples';

import { ProductTransactionFormService } from './product-transaction-form.service';

describe('ProductTransaction Form Service', () => {
  let service: ProductTransactionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTransactionFormService);
  });

  describe('Service methods', () => {
    describe('createProductTransactionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductTransactionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            refrenceId: expect.any(Object),
            transactionType: expect.any(Object),
            transactionStatus: expect.any(Object),
            transactionDate: expect.any(Object),
            description: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            securityUser: expect.any(Object),
            wareHouse: expect.any(Object),
          })
        );
      });

      it('passing IProductTransaction should create a new form with FormGroup', () => {
        const formGroup = service.createProductTransactionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            refrenceId: expect.any(Object),
            transactionType: expect.any(Object),
            transactionStatus: expect.any(Object),
            transactionDate: expect.any(Object),
            description: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            securityUser: expect.any(Object),
            wareHouse: expect.any(Object),
          })
        );
      });
    });

    describe('getProductTransaction', () => {
      it('should return NewProductTransaction for default ProductTransaction initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProductTransactionFormGroup(sampleWithNewData);

        const productTransaction = service.getProductTransaction(formGroup) as any;

        expect(productTransaction).toMatchObject(sampleWithNewData);
      });

      it('should return NewProductTransaction for empty ProductTransaction initial value', () => {
        const formGroup = service.createProductTransactionFormGroup();

        const productTransaction = service.getProductTransaction(formGroup) as any;

        expect(productTransaction).toMatchObject({});
      });

      it('should return IProductTransaction', () => {
        const formGroup = service.createProductTransactionFormGroup(sampleWithRequiredData);

        const productTransaction = service.getProductTransaction(formGroup) as any;

        expect(productTransaction).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProductTransaction should not enable id FormControl', () => {
        const formGroup = service.createProductTransactionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProductTransaction should disable id FormControl', () => {
        const formGroup = service.createProductTransactionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
