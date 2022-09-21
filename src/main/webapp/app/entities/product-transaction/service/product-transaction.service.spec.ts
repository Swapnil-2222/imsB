import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductTransaction } from '../product-transaction.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../product-transaction.test-samples';

import { ProductTransactionService } from './product-transaction.service';

const requireRestSample: IProductTransaction = {
  ...sampleWithRequiredData,
};

describe('ProductTransaction Service', () => {
  let service: ProductTransactionService;
  let httpMock: HttpTestingController;
  let expectedResult: IProductTransaction | IProductTransaction[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductTransactionService);
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

    it('should create a ProductTransaction', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const productTransaction = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(productTransaction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductTransaction', () => {
      const productTransaction = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(productTransaction).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductTransaction', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductTransaction', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProductTransaction', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProductTransactionToCollectionIfMissing', () => {
      it('should add a ProductTransaction to an empty array', () => {
        const productTransaction: IProductTransaction = sampleWithRequiredData;
        expectedResult = service.addProductTransactionToCollectionIfMissing([], productTransaction);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productTransaction);
      });

      it('should not add a ProductTransaction to an array that contains it', () => {
        const productTransaction: IProductTransaction = sampleWithRequiredData;
        const productTransactionCollection: IProductTransaction[] = [
          {
            ...productTransaction,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProductTransactionToCollectionIfMissing(productTransactionCollection, productTransaction);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductTransaction to an array that doesn't contain it", () => {
        const productTransaction: IProductTransaction = sampleWithRequiredData;
        const productTransactionCollection: IProductTransaction[] = [sampleWithPartialData];
        expectedResult = service.addProductTransactionToCollectionIfMissing(productTransactionCollection, productTransaction);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productTransaction);
      });

      it('should add only unique ProductTransaction to an array', () => {
        const productTransactionArray: IProductTransaction[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const productTransactionCollection: IProductTransaction[] = [sampleWithRequiredData];
        expectedResult = service.addProductTransactionToCollectionIfMissing(productTransactionCollection, ...productTransactionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productTransaction: IProductTransaction = sampleWithRequiredData;
        const productTransaction2: IProductTransaction = sampleWithPartialData;
        expectedResult = service.addProductTransactionToCollectionIfMissing([], productTransaction, productTransaction2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productTransaction);
        expect(expectedResult).toContain(productTransaction2);
      });

      it('should accept null and undefined values', () => {
        const productTransaction: IProductTransaction = sampleWithRequiredData;
        expectedResult = service.addProductTransactionToCollectionIfMissing([], null, productTransaction, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productTransaction);
      });

      it('should return initial array if no ProductTransaction is added', () => {
        const productTransactionCollection: IProductTransaction[] = [sampleWithRequiredData];
        expectedResult = service.addProductTransactionToCollectionIfMissing(productTransactionCollection, undefined, null);
        expect(expectedResult).toEqual(productTransactionCollection);
      });
    });

    describe('compareProductTransaction', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProductTransaction(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProductTransaction(entity1, entity2);
        const compareResult2 = service.compareProductTransaction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProductTransaction(entity1, entity2);
        const compareResult2 = service.compareProductTransaction(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProductTransaction(entity1, entity2);
        const compareResult2 = service.compareProductTransaction(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
