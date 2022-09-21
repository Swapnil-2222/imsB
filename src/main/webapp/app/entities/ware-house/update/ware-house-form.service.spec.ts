import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ware-house.test-samples';

import { WareHouseFormService } from './ware-house-form.service';

describe('WareHouse Form Service', () => {
  let service: WareHouseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WareHouseFormService);
  });

  describe('Service methods', () => {
    describe('createWareHouseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWareHouseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            whName: expect.any(Object),
            address: expect.any(Object),
            pincode: expect.any(Object),
            city: expect.any(Object),
            state: expect.any(Object),
            country: expect.any(Object),
            gSTDetails: expect.any(Object),
            managerName: expect.any(Object),
            managerEmail: expect.any(Object),
            managerContact: expect.any(Object),
            contact: expect.any(Object),
            isDeleted: expect.any(Object),
            isActive: expect.any(Object),
            wareHouseId: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            productInventories: expect.any(Object),
            securityUsers: expect.any(Object),
          })
        );
      });

      it('passing IWareHouse should create a new form with FormGroup', () => {
        const formGroup = service.createWareHouseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            whName: expect.any(Object),
            address: expect.any(Object),
            pincode: expect.any(Object),
            city: expect.any(Object),
            state: expect.any(Object),
            country: expect.any(Object),
            gSTDetails: expect.any(Object),
            managerName: expect.any(Object),
            managerEmail: expect.any(Object),
            managerContact: expect.any(Object),
            contact: expect.any(Object),
            isDeleted: expect.any(Object),
            isActive: expect.any(Object),
            wareHouseId: expect.any(Object),
            lastModified: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            productInventories: expect.any(Object),
            securityUsers: expect.any(Object),
          })
        );
      });
    });

    describe('getWareHouse', () => {
      it('should return NewWareHouse for default WareHouse initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWareHouseFormGroup(sampleWithNewData);

        const wareHouse = service.getWareHouse(formGroup) as any;

        expect(wareHouse).toMatchObject(sampleWithNewData);
      });

      it('should return NewWareHouse for empty WareHouse initial value', () => {
        const formGroup = service.createWareHouseFormGroup();

        const wareHouse = service.getWareHouse(formGroup) as any;

        expect(wareHouse).toMatchObject({});
      });

      it('should return IWareHouse', () => {
        const formGroup = service.createWareHouseFormGroup(sampleWithRequiredData);

        const wareHouse = service.getWareHouse(formGroup) as any;

        expect(wareHouse).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWareHouse should not enable id FormControl', () => {
        const formGroup = service.createWareHouseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWareHouse should disable id FormControl', () => {
        const formGroup = service.createWareHouseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
