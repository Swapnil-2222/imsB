import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../transfer-details.test-samples';

import { TransferDetailsFormService } from './transfer-details-form.service';

describe('TransferDetails Form Service', () => {
  let service: TransferDetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferDetailsFormService);
  });

  describe('Service methods', () => {
    describe('createTransferDetailsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTransferDetailsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            approvalDate: expect.any(Object),
            qty: expect.any(Object),
            comment: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            isDeleted: expect.any(Object),
            isActive: expect.any(Object),
            wareHouse: expect.any(Object),
            product: expect.any(Object),
            transfer: expect.any(Object),
          })
        );
      });

      it('passing ITransferDetails should create a new form with FormGroup', () => {
        const formGroup = service.createTransferDetailsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            approvalDate: expect.any(Object),
            qty: expect.any(Object),
            comment: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            isDeleted: expect.any(Object),
            isActive: expect.any(Object),
            wareHouse: expect.any(Object),
            product: expect.any(Object),
            transfer: expect.any(Object),
          })
        );
      });
    });

    describe('getTransferDetails', () => {
      it('should return NewTransferDetails for default TransferDetails initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTransferDetailsFormGroup(sampleWithNewData);

        const transferDetails = service.getTransferDetails(formGroup) as any;

        expect(transferDetails).toMatchObject(sampleWithNewData);
      });

      it('should return NewTransferDetails for empty TransferDetails initial value', () => {
        const formGroup = service.createTransferDetailsFormGroup();

        const transferDetails = service.getTransferDetails(formGroup) as any;

        expect(transferDetails).toMatchObject({});
      });

      it('should return ITransferDetails', () => {
        const formGroup = service.createTransferDetailsFormGroup(sampleWithRequiredData);

        const transferDetails = service.getTransferDetails(formGroup) as any;

        expect(transferDetails).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITransferDetails should not enable id FormControl', () => {
        const formGroup = service.createTransferDetailsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTransferDetails should disable id FormControl', () => {
        const formGroup = service.createTransferDetailsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
