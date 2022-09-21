import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../transfer.test-samples';

import { TransferFormService } from './transfer-form.service';

describe('Transfer Form Service', () => {
  let service: TransferFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferFormService);
  });

  describe('Service methods', () => {
    describe('createTransferFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTransferFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tranferDate: expect.any(Object),
            comment: expect.any(Object),
            status: expect.any(Object),
            sourceWareHouse: expect.any(Object),
            destinationWareHouse: expect.any(Object),
            freeField1: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            securityUser: expect.any(Object),
            wareHouse: expect.any(Object),
          })
        );
      });

      it('passing ITransfer should create a new form with FormGroup', () => {
        const formGroup = service.createTransferFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tranferDate: expect.any(Object),
            comment: expect.any(Object),
            status: expect.any(Object),
            sourceWareHouse: expect.any(Object),
            destinationWareHouse: expect.any(Object),
            freeField1: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            securityUser: expect.any(Object),
            wareHouse: expect.any(Object),
          })
        );
      });
    });

    describe('getTransfer', () => {
      it('should return NewTransfer for default Transfer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTransferFormGroup(sampleWithNewData);

        const transfer = service.getTransfer(formGroup) as any;

        expect(transfer).toMatchObject(sampleWithNewData);
      });

      it('should return NewTransfer for empty Transfer initial value', () => {
        const formGroup = service.createTransferFormGroup();

        const transfer = service.getTransfer(formGroup) as any;

        expect(transfer).toMatchObject({});
      });

      it('should return ITransfer', () => {
        const formGroup = service.createTransferFormGroup(sampleWithRequiredData);

        const transfer = service.getTransfer(formGroup) as any;

        expect(transfer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITransfer should not enable id FormControl', () => {
        const formGroup = service.createTransferFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTransfer should disable id FormControl', () => {
        const formGroup = service.createTransferFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
