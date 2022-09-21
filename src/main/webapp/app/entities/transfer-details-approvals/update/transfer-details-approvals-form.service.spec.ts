import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../transfer-details-approvals.test-samples';

import { TransferDetailsApprovalsFormService } from './transfer-details-approvals-form.service';

describe('TransferDetailsApprovals Form Service', () => {
  let service: TransferDetailsApprovalsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferDetailsApprovalsFormService);
  });

  describe('Service methods', () => {
    describe('createTransferDetailsApprovalsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTransferDetailsApprovalsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            approvalDate: expect.any(Object),
            qtyRequested: expect.any(Object),
            qtyApproved: expect.any(Object),
            comment: expect.any(Object),
            freeField1: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            isDeleted: expect.any(Object),
            isActive: expect.any(Object),
            securityUser: expect.any(Object),
            transfer: expect.any(Object),
          })
        );
      });

      it('passing ITransferDetailsApprovals should create a new form with FormGroup', () => {
        const formGroup = service.createTransferDetailsApprovalsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            approvalDate: expect.any(Object),
            qtyRequested: expect.any(Object),
            qtyApproved: expect.any(Object),
            comment: expect.any(Object),
            freeField1: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            isDeleted: expect.any(Object),
            isActive: expect.any(Object),
            securityUser: expect.any(Object),
            transfer: expect.any(Object),
          })
        );
      });
    });

    describe('getTransferDetailsApprovals', () => {
      it('should return NewTransferDetailsApprovals for default TransferDetailsApprovals initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTransferDetailsApprovalsFormGroup(sampleWithNewData);

        const transferDetailsApprovals = service.getTransferDetailsApprovals(formGroup) as any;

        expect(transferDetailsApprovals).toMatchObject(sampleWithNewData);
      });

      it('should return NewTransferDetailsApprovals for empty TransferDetailsApprovals initial value', () => {
        const formGroup = service.createTransferDetailsApprovalsFormGroup();

        const transferDetailsApprovals = service.getTransferDetailsApprovals(formGroup) as any;

        expect(transferDetailsApprovals).toMatchObject({});
      });

      it('should return ITransferDetailsApprovals', () => {
        const formGroup = service.createTransferDetailsApprovalsFormGroup(sampleWithRequiredData);

        const transferDetailsApprovals = service.getTransferDetailsApprovals(formGroup) as any;

        expect(transferDetailsApprovals).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITransferDetailsApprovals should not enable id FormControl', () => {
        const formGroup = service.createTransferDetailsApprovalsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTransferDetailsApprovals should disable id FormControl', () => {
        const formGroup = service.createTransferDetailsApprovalsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
