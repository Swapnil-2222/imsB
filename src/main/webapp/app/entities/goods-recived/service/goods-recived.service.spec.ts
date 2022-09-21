import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGoodsRecived } from '../goods-recived.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../goods-recived.test-samples';

import { GoodsRecivedService, RestGoodsRecived } from './goods-recived.service';

const requireRestSample: RestGoodsRecived = {
  ...sampleWithRequiredData,
  grDate: sampleWithRequiredData.grDate?.toJSON(),
  manufacturingDate: sampleWithRequiredData.manufacturingDate?.toJSON(),
  expiryDate: sampleWithRequiredData.expiryDate?.toJSON(),
};

describe('GoodsRecived Service', () => {
  let service: GoodsRecivedService;
  let httpMock: HttpTestingController;
  let expectedResult: IGoodsRecived | IGoodsRecived[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GoodsRecivedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a GoodsRecived', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const goodsRecived = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(goodsRecived).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GoodsRecived', () => {
      const goodsRecived = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(goodsRecived).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GoodsRecived', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GoodsRecived', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GoodsRecived', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGoodsRecivedToCollectionIfMissing', () => {
      it('should add a GoodsRecived to an empty array', () => {
        const goodsRecived: IGoodsRecived = sampleWithRequiredData;
        expectedResult = service.addGoodsRecivedToCollectionIfMissing([], goodsRecived);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(goodsRecived);
      });

      it('should not add a GoodsRecived to an array that contains it', () => {
        const goodsRecived: IGoodsRecived = sampleWithRequiredData;
        const goodsRecivedCollection: IGoodsRecived[] = [
          {
            ...goodsRecived,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGoodsRecivedToCollectionIfMissing(goodsRecivedCollection, goodsRecived);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GoodsRecived to an array that doesn't contain it", () => {
        const goodsRecived: IGoodsRecived = sampleWithRequiredData;
        const goodsRecivedCollection: IGoodsRecived[] = [sampleWithPartialData];
        expectedResult = service.addGoodsRecivedToCollectionIfMissing(goodsRecivedCollection, goodsRecived);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(goodsRecived);
      });

      it('should add only unique GoodsRecived to an array', () => {
        const goodsRecivedArray: IGoodsRecived[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const goodsRecivedCollection: IGoodsRecived[] = [sampleWithRequiredData];
        expectedResult = service.addGoodsRecivedToCollectionIfMissing(goodsRecivedCollection, ...goodsRecivedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const goodsRecived: IGoodsRecived = sampleWithRequiredData;
        const goodsRecived2: IGoodsRecived = sampleWithPartialData;
        expectedResult = service.addGoodsRecivedToCollectionIfMissing([], goodsRecived, goodsRecived2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(goodsRecived);
        expect(expectedResult).toContain(goodsRecived2);
      });

      it('should accept null and undefined values', () => {
        const goodsRecived: IGoodsRecived = sampleWithRequiredData;
        expectedResult = service.addGoodsRecivedToCollectionIfMissing([], null, goodsRecived, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(goodsRecived);
      });

      it('should return initial array if no GoodsRecived is added', () => {
        const goodsRecivedCollection: IGoodsRecived[] = [sampleWithRequiredData];
        expectedResult = service.addGoodsRecivedToCollectionIfMissing(goodsRecivedCollection, undefined, null);
        expect(expectedResult).toEqual(goodsRecivedCollection);
      });
    });

    describe('compareGoodsRecived', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGoodsRecived(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGoodsRecived(entity1, entity2);
        const compareResult2 = service.compareGoodsRecived(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGoodsRecived(entity1, entity2);
        const compareResult2 = service.compareGoodsRecived(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGoodsRecived(entity1, entity2);
        const compareResult2 = service.compareGoodsRecived(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
