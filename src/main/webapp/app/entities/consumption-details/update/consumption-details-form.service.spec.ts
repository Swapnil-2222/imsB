import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../consumption-details.test-samples';

import { ConsumptionDetailsFormService } from './consumption-details-form.service';

describe('ConsumptionDetails Form Service', () => {
  let service: ConsumptionDetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumptionDetailsFormService);
  });

  describe('Service methods', () => {
    describe('createConsumptionDetailsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createConsumptionDetailsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            comsumptionDate: expect.any(Object),
            qtyConsumed: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            securityUser: expect.any(Object),
            project: expect.any(Object),
            productInventory: expect.any(Object),
          })
        );
      });

      it('passing IConsumptionDetails should create a new form with FormGroup', () => {
        const formGroup = service.createConsumptionDetailsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            comsumptionDate: expect.any(Object),
            qtyConsumed: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            securityUser: expect.any(Object),
            project: expect.any(Object),
            productInventory: expect.any(Object),
          })
        );
      });
    });

    describe('getConsumptionDetails', () => {
      it('should return NewConsumptionDetails for default ConsumptionDetails initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createConsumptionDetailsFormGroup(sampleWithNewData);

        const consumptionDetails = service.getConsumptionDetails(formGroup) as any;

        expect(consumptionDetails).toMatchObject(sampleWithNewData);
      });

      it('should return NewConsumptionDetails for empty ConsumptionDetails initial value', () => {
        const formGroup = service.createConsumptionDetailsFormGroup();

        const consumptionDetails = service.getConsumptionDetails(formGroup) as any;

        expect(consumptionDetails).toMatchObject({});
      });

      it('should return IConsumptionDetails', () => {
        const formGroup = service.createConsumptionDetailsFormGroup(sampleWithRequiredData);

        const consumptionDetails = service.getConsumptionDetails(formGroup) as any;

        expect(consumptionDetails).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConsumptionDetails should not enable id FormControl', () => {
        const formGroup = service.createConsumptionDetailsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConsumptionDetails should disable id FormControl', () => {
        const formGroup = service.createConsumptionDetailsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
