import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../product-inventory.test-samples';

import { ProductInventoryFormService } from './product-inventory-form.service';

describe('ProductInventory Form Service', () => {
  let service: ProductInventoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductInventoryFormService);
  });

  describe('Service methods', () => {
    describe('createProductInventoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductInventoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            inwardOutwardDate: expect.any(Object),
            inwardQty: expect.any(Object),
            outwardQty: expect.any(Object),
            totalQuanity: expect.any(Object),
            pricePerUnit: expect.any(Object),
            lotNo: expect.any(Object),
            expiryDate: expect.any(Object),
            inventoryTypeId: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            isDeleted: expect.any(Object),
            isActive: expect.any(Object),
            product: expect.any(Object),
            purchaseQuotation: expect.any(Object),
            productTransaction: expect.any(Object),
            wareHouses: expect.any(Object),
            securityUsers: expect.any(Object),
          })
        );
      });

      it('passing IProductInventory should create a new form with FormGroup', () => {
        const formGroup = service.createProductInventoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            inwardOutwardDate: expect.any(Object),
            inwardQty: expect.any(Object),
            outwardQty: expect.any(Object),
            totalQuanity: expect.any(Object),
            pricePerUnit: expect.any(Object),
            lotNo: expect.any(Object),
            expiryDate: expect.any(Object),
            inventoryTypeId: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            isDeleted: expect.any(Object),
            isActive: expect.any(Object),
            product: expect.any(Object),
            purchaseQuotation: expect.any(Object),
            productTransaction: expect.any(Object),
            wareHouses: expect.any(Object),
            securityUsers: expect.any(Object),
          })
        );
      });
    });

    describe('getProductInventory', () => {
      it('should return NewProductInventory for default ProductInventory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProductInventoryFormGroup(sampleWithNewData);

        const productInventory = service.getProductInventory(formGroup) as any;

        expect(productInventory).toMatchObject(sampleWithNewData);
      });

      it('should return NewProductInventory for empty ProductInventory initial value', () => {
        const formGroup = service.createProductInventoryFormGroup();

        const productInventory = service.getProductInventory(formGroup) as any;

        expect(productInventory).toMatchObject({});
      });

      it('should return IProductInventory', () => {
        const formGroup = service.createProductInventoryFormGroup(sampleWithRequiredData);

        const productInventory = service.getProductInventory(formGroup) as any;

        expect(productInventory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProductInventory should not enable id FormControl', () => {
        const formGroup = service.createProductInventoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProductInventory should disable id FormControl', () => {
        const formGroup = service.createProductInventoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
