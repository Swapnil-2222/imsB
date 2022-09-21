import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPurchaseQuotation } from '../purchase-quotation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../purchase-quotation.test-samples';

import { PurchaseQuotationService, RestPurchaseQuotation } from './purchase-quotation.service';

const requireRestSample: RestPurchaseQuotation = {
  ...sampleWithRequiredData,
  expectedDeliveryDate: sampleWithRequiredData.expectedDeliveryDate?.toJSON(),
  poDate: sampleWithRequiredData.poDate?.toJSON(),
};

describe('PurchaseQuotation Service', () => {
  let service: PurchaseQuotationService;
  let httpMock: HttpTestingController;
  let expectedResult: IPurchaseQuotation | IPurchaseQuotation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PurchaseQuotationService);
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

    it('should create a PurchaseQuotation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const purchaseQuotation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(purchaseQuotation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PurchaseQuotation', () => {
      const purchaseQuotation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(purchaseQuotation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PurchaseQuotation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PurchaseQuotation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PurchaseQuotation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPurchaseQuotationToCollectionIfMissing', () => {
      it('should add a PurchaseQuotation to an empty array', () => {
        const purchaseQuotation: IPurchaseQuotation = sampleWithRequiredData;
        expectedResult = service.addPurchaseQuotationToCollectionIfMissing([], purchaseQuotation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(purchaseQuotation);
      });

      it('should not add a PurchaseQuotation to an array that contains it', () => {
        const purchaseQuotation: IPurchaseQuotation = sampleWithRequiredData;
        const purchaseQuotationCollection: IPurchaseQuotation[] = [
          {
            ...purchaseQuotation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPurchaseQuotationToCollectionIfMissing(purchaseQuotationCollection, purchaseQuotation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PurchaseQuotation to an array that doesn't contain it", () => {
        const purchaseQuotation: IPurchaseQuotation = sampleWithRequiredData;
        const purchaseQuotationCollection: IPurchaseQuotation[] = [sampleWithPartialData];
        expectedResult = service.addPurchaseQuotationToCollectionIfMissing(purchaseQuotationCollection, purchaseQuotation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(purchaseQuotation);
      });

      it('should add only unique PurchaseQuotation to an array', () => {
        const purchaseQuotationArray: IPurchaseQuotation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const purchaseQuotationCollection: IPurchaseQuotation[] = [sampleWithRequiredData];
        expectedResult = service.addPurchaseQuotationToCollectionIfMissing(purchaseQuotationCollection, ...purchaseQuotationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const purchaseQuotation: IPurchaseQuotation = sampleWithRequiredData;
        const purchaseQuotation2: IPurchaseQuotation = sampleWithPartialData;
        expectedResult = service.addPurchaseQuotationToCollectionIfMissing([], purchaseQuotation, purchaseQuotation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(purchaseQuotation);
        expect(expectedResult).toContain(purchaseQuotation2);
      });

      it('should accept null and undefined values', () => {
        const purchaseQuotation: IPurchaseQuotation = sampleWithRequiredData;
        expectedResult = service.addPurchaseQuotationToCollectionIfMissing([], null, purchaseQuotation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(purchaseQuotation);
      });

      it('should return initial array if no PurchaseQuotation is added', () => {
        const purchaseQuotationCollection: IPurchaseQuotation[] = [sampleWithRequiredData];
        expectedResult = service.addPurchaseQuotationToCollectionIfMissing(purchaseQuotationCollection, undefined, null);
        expect(expectedResult).toEqual(purchaseQuotationCollection);
      });
    });

    describe('comparePurchaseQuotation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePurchaseQuotation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePurchaseQuotation(entity1, entity2);
        const compareResult2 = service.comparePurchaseQuotation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePurchaseQuotation(entity1, entity2);
        const compareResult2 = service.comparePurchaseQuotation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePurchaseQuotation(entity1, entity2);
        const compareResult2 = service.comparePurchaseQuotation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
