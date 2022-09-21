import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../purchase-quotation-details.test-samples';

import { PurchaseQuotationDetailsFormService } from './purchase-quotation-details-form.service';

describe('PurchaseQuotationDetails Form Service', () => {
  let service: PurchaseQuotationDetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseQuotationDetailsFormService);
  });

  describe('Service methods', () => {
    describe('createPurchaseQuotationDetailsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPurchaseQuotationDetailsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            qtyordered: expect.any(Object),
            gstTaxPercentage: expect.any(Object),
            pricePerUnit: expect.any(Object),
            totalPrice: expect.any(Object),
            discount: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            purchaseQuotation: expect.any(Object),
          })
        );
      });

      it('passing IPurchaseQuotationDetails should create a new form with FormGroup', () => {
        const formGroup = service.createPurchaseQuotationDetailsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            qtyordered: expect.any(Object),
            gstTaxPercentage: expect.any(Object),
            pricePerUnit: expect.any(Object),
            totalPrice: expect.any(Object),
            discount: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            purchaseQuotation: expect.any(Object),
          })
        );
      });
    });

    describe('getPurchaseQuotationDetails', () => {
      it('should return NewPurchaseQuotationDetails for default PurchaseQuotationDetails initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPurchaseQuotationDetailsFormGroup(sampleWithNewData);

        const purchaseQuotationDetails = service.getPurchaseQuotationDetails(formGroup) as any;

        expect(purchaseQuotationDetails).toMatchObject(sampleWithNewData);
      });

      it('should return NewPurchaseQuotationDetails for empty PurchaseQuotationDetails initial value', () => {
        const formGroup = service.createPurchaseQuotationDetailsFormGroup();

        const purchaseQuotationDetails = service.getPurchaseQuotationDetails(formGroup) as any;

        expect(purchaseQuotationDetails).toMatchObject({});
      });

      it('should return IPurchaseQuotationDetails', () => {
        const formGroup = service.createPurchaseQuotationDetailsFormGroup(sampleWithRequiredData);

        const purchaseQuotationDetails = service.getPurchaseQuotationDetails(formGroup) as any;

        expect(purchaseQuotationDetails).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPurchaseQuotationDetails should not enable id FormControl', () => {
        const formGroup = service.createPurchaseQuotationDetailsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPurchaseQuotationDetails should disable id FormControl', () => {
        const formGroup = service.createPurchaseQuotationDetailsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
