import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../purchase-quotation.test-samples';

import { PurchaseQuotationFormService } from './purchase-quotation-form.service';

describe('PurchaseQuotation Form Service', () => {
  let service: PurchaseQuotationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseQuotationFormService);
  });

  describe('Service methods', () => {
    describe('createPurchaseQuotationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPurchaseQuotationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalPOAmount: expect.any(Object),
            totalGSTAmount: expect.any(Object),
            expectedDeliveryDate: expect.any(Object),
            poDate: expect.any(Object),
            orderType: expect.any(Object),
            orderStatus: expect.any(Object),
            clientName: expect.any(Object),
            clientMobile: expect.any(Object),
            clientEmail: expect.any(Object),
            termsAndCondition: expect.any(Object),
            notes: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            securityUser: expect.any(Object),
          })
        );
      });

      it('passing IPurchaseQuotation should create a new form with FormGroup', () => {
        const formGroup = service.createPurchaseQuotationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalPOAmount: expect.any(Object),
            totalGSTAmount: expect.any(Object),
            expectedDeliveryDate: expect.any(Object),
            poDate: expect.any(Object),
            orderType: expect.any(Object),
            orderStatus: expect.any(Object),
            clientName: expect.any(Object),
            clientMobile: expect.any(Object),
            clientEmail: expect.any(Object),
            termsAndCondition: expect.any(Object),
            notes: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            securityUser: expect.any(Object),
          })
        );
      });
    });

    describe('getPurchaseQuotation', () => {
      it('should return NewPurchaseQuotation for default PurchaseQuotation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPurchaseQuotationFormGroup(sampleWithNewData);

        const purchaseQuotation = service.getPurchaseQuotation(formGroup) as any;

        expect(purchaseQuotation).toMatchObject(sampleWithNewData);
      });

      it('should return NewPurchaseQuotation for empty PurchaseQuotation initial value', () => {
        const formGroup = service.createPurchaseQuotationFormGroup();

        const purchaseQuotation = service.getPurchaseQuotation(formGroup) as any;

        expect(purchaseQuotation).toMatchObject({});
      });

      it('should return IPurchaseQuotation', () => {
        const formGroup = service.createPurchaseQuotationFormGroup(sampleWithRequiredData);

        const purchaseQuotation = service.getPurchaseQuotation(formGroup) as any;

        expect(purchaseQuotation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPurchaseQuotation should not enable id FormControl', () => {
        const formGroup = service.createPurchaseQuotationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPurchaseQuotation should disable id FormControl', () => {
        const formGroup = service.createPurchaseQuotationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
