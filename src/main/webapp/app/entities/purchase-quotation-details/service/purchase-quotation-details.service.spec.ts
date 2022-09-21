import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPurchaseQuotationDetails } from '../purchase-quotation-details.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../purchase-quotation-details.test-samples';

import { PurchaseQuotationDetailsService } from './purchase-quotation-details.service';

const requireRestSample: IPurchaseQuotationDetails = {
  ...sampleWithRequiredData,
};

describe('PurchaseQuotationDetails Service', () => {
  let service: PurchaseQuotationDetailsService;
  let httpMock: HttpTestingController;
  let expectedResult: IPurchaseQuotationDetails | IPurchaseQuotationDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PurchaseQuotationDetailsService);
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

    it('should create a PurchaseQuotationDetails', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const purchaseQuotationDetails = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(purchaseQuotationDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PurchaseQuotationDetails', () => {
      const purchaseQuotationDetails = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(purchaseQuotationDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PurchaseQuotationDetails', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PurchaseQuotationDetails', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PurchaseQuotationDetails', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPurchaseQuotationDetailsToCollectionIfMissing', () => {
      it('should add a PurchaseQuotationDetails to an empty array', () => {
        const purchaseQuotationDetails: IPurchaseQuotationDetails = sampleWithRequiredData;
        expectedResult = service.addPurchaseQuotationDetailsToCollectionIfMissing([], purchaseQuotationDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(purchaseQuotationDetails);
      });

      it('should not add a PurchaseQuotationDetails to an array that contains it', () => {
        const purchaseQuotationDetails: IPurchaseQuotationDetails = sampleWithRequiredData;
        const purchaseQuotationDetailsCollection: IPurchaseQuotationDetails[] = [
          {
            ...purchaseQuotationDetails,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPurchaseQuotationDetailsToCollectionIfMissing(
          purchaseQuotationDetailsCollection,
          purchaseQuotationDetails
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PurchaseQuotationDetails to an array that doesn't contain it", () => {
        const purchaseQuotationDetails: IPurchaseQuotationDetails = sampleWithRequiredData;
        const purchaseQuotationDetailsCollection: IPurchaseQuotationDetails[] = [sampleWithPartialData];
        expectedResult = service.addPurchaseQuotationDetailsToCollectionIfMissing(
          purchaseQuotationDetailsCollection,
          purchaseQuotationDetails
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(purchaseQuotationDetails);
      });

      it('should add only unique PurchaseQuotationDetails to an array', () => {
        const purchaseQuotationDetailsArray: IPurchaseQuotationDetails[] = [
          sampleWithRequiredData,
          sampleWithPartialData,
          sampleWithFullData,
        ];
        const purchaseQuotationDetailsCollection: IPurchaseQuotationDetails[] = [sampleWithRequiredData];
        expectedResult = service.addPurchaseQuotationDetailsToCollectionIfMissing(
          purchaseQuotationDetailsCollection,
          ...purchaseQuotationDetailsArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const purchaseQuotationDetails: IPurchaseQuotationDetails = sampleWithRequiredData;
        const purchaseQuotationDetails2: IPurchaseQuotationDetails = sampleWithPartialData;
        expectedResult = service.addPurchaseQuotationDetailsToCollectionIfMissing([], purchaseQuotationDetails, purchaseQuotationDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(purchaseQuotationDetails);
        expect(expectedResult).toContain(purchaseQuotationDetails2);
      });

      it('should accept null and undefined values', () => {
        const purchaseQuotationDetails: IPurchaseQuotationDetails = sampleWithRequiredData;
        expectedResult = service.addPurchaseQuotationDetailsToCollectionIfMissing([], null, purchaseQuotationDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(purchaseQuotationDetails);
      });

      it('should return initial array if no PurchaseQuotationDetails is added', () => {
        const purchaseQuotationDetailsCollection: IPurchaseQuotationDetails[] = [sampleWithRequiredData];
        expectedResult = service.addPurchaseQuotationDetailsToCollectionIfMissing(purchaseQuotationDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(purchaseQuotationDetailsCollection);
      });
    });

    describe('comparePurchaseQuotationDetails', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePurchaseQuotationDetails(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePurchaseQuotationDetails(entity1, entity2);
        const compareResult2 = service.comparePurchaseQuotationDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePurchaseQuotationDetails(entity1, entity2);
        const compareResult2 = service.comparePurchaseQuotationDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePurchaseQuotationDetails(entity1, entity2);
        const compareResult2 = service.comparePurchaseQuotationDetails(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
