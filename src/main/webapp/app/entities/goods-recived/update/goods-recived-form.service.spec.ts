import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../goods-recived.test-samples';

import { GoodsRecivedFormService } from './goods-recived-form.service';

describe('GoodsRecived Form Service', () => {
  let service: GoodsRecivedFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsRecivedFormService);
  });

  describe('Service methods', () => {
    describe('createGoodsRecivedFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGoodsRecivedFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            grDate: expect.any(Object),
            qtyOrdered: expect.any(Object),
            qtyRecieved: expect.any(Object),
            manufacturingDate: expect.any(Object),
            expiryDate: expect.any(Object),
            lotNo: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            freeField3: expect.any(Object),
            purchaseQuotation: expect.any(Object),
          })
        );
      });

      it('passing IGoodsRecived should create a new form with FormGroup', () => {
        const formGroup = service.createGoodsRecivedFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            grDate: expect.any(Object),
            qtyOrdered: expect.any(Object),
            qtyRecieved: expect.any(Object),
            manufacturingDate: expect.any(Object),
            expiryDate: expect.any(Object),
            lotNo: expect.any(Object),
            freeField1: expect.any(Object),
            freeField2: expect.any(Object),
            freeField3: expect.any(Object),
            purchaseQuotation: expect.any(Object),
          })
        );
      });
    });

    describe('getGoodsRecived', () => {
      it('should return NewGoodsRecived for default GoodsRecived initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGoodsRecivedFormGroup(sampleWithNewData);

        const goodsRecived = service.getGoodsRecived(formGroup) as any;

        expect(goodsRecived).toMatchObject(sampleWithNewData);
      });

      it('should return NewGoodsRecived for empty GoodsRecived initial value', () => {
        const formGroup = service.createGoodsRecivedFormGroup();

        const goodsRecived = service.getGoodsRecived(formGroup) as any;

        expect(goodsRecived).toMatchObject({});
      });

      it('should return IGoodsRecived', () => {
        const formGroup = service.createGoodsRecivedFormGroup(sampleWithRequiredData);

        const goodsRecived = service.getGoodsRecived(formGroup) as any;

        expect(goodsRecived).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGoodsRecived should not enable id FormControl', () => {
        const formGroup = service.createGoodsRecivedFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGoodsRecived should disable id FormControl', () => {
        const formGroup = service.createGoodsRecivedFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
