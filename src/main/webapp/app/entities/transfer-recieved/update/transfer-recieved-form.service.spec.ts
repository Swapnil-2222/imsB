import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../transfer-recieved.test-samples';

import { TransferRecievedFormService } from './transfer-recieved-form.service';

describe('TransferRecieved Form Service', () => {
  let service: TransferRecievedFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferRecievedFormService);
  });

  describe('Service methods', () => {
    describe('createTransferRecievedFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTransferRecievedFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            transferDate: expect.any(Object),
            qtyTransfered: expect.any(Object),
            qtyReceived: expect.any(Object),
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

      it('passing ITransferRecieved should create a new form with FormGroup', () => {
        const formGroup = service.createTransferRecievedFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            transferDate: expect.any(Object),
            qtyTransfered: expect.any(Object),
            qtyReceived: expect.any(Object),
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

    describe('getTransferRecieved', () => {
      it('should return NewTransferRecieved for default TransferRecieved initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTransferRecievedFormGroup(sampleWithNewData);

        const transferRecieved = service.getTransferRecieved(formGroup) as any;

        expect(transferRecieved).toMatchObject(sampleWithNewData);
      });

      it('should return NewTransferRecieved for empty TransferRecieved initial value', () => {
        const formGroup = service.createTransferRecievedFormGroup();

        const transferRecieved = service.getTransferRecieved(formGroup) as any;

        expect(transferRecieved).toMatchObject({});
      });

      it('should return ITransferRecieved', () => {
        const formGroup = service.createTransferRecievedFormGroup(sampleWithRequiredData);

        const transferRecieved = service.getTransferRecieved(formGroup) as any;

        expect(transferRecieved).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITransferRecieved should not enable id FormControl', () => {
        const formGroup = service.createTransferRecievedFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTransferRecieved should disable id FormControl', () => {
        const formGroup = service.createTransferRecievedFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
