import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITransferDetails } from '../transfer-details.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../transfer-details.test-samples';

import { TransferDetailsService, RestTransferDetails } from './transfer-details.service';

const requireRestSample: RestTransferDetails = {
  ...sampleWithRequiredData,
  approvalDate: sampleWithRequiredData.approvalDate?.toJSON(),
};

describe('TransferDetails Service', () => {
  let service: TransferDetailsService;
  let httpMock: HttpTestingController;
  let expectedResult: ITransferDetails | ITransferDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TransferDetailsService);
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

    it('should create a TransferDetails', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const transferDetails = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(transferDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TransferDetails', () => {
      const transferDetails = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(transferDetails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TransferDetails', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TransferDetails', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TransferDetails', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTransferDetailsToCollectionIfMissing', () => {
      it('should add a TransferDetails to an empty array', () => {
        const transferDetails: ITransferDetails = sampleWithRequiredData;
        expectedResult = service.addTransferDetailsToCollectionIfMissing([], transferDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(transferDetails);
      });

      it('should not add a TransferDetails to an array that contains it', () => {
        const transferDetails: ITransferDetails = sampleWithRequiredData;
        const transferDetailsCollection: ITransferDetails[] = [
          {
            ...transferDetails,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTransferDetailsToCollectionIfMissing(transferDetailsCollection, transferDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TransferDetails to an array that doesn't contain it", () => {
        const transferDetails: ITransferDetails = sampleWithRequiredData;
        const transferDetailsCollection: ITransferDetails[] = [sampleWithPartialData];
        expectedResult = service.addTransferDetailsToCollectionIfMissing(transferDetailsCollection, transferDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(transferDetails);
      });

      it('should add only unique TransferDetails to an array', () => {
        const transferDetailsArray: ITransferDetails[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const transferDetailsCollection: ITransferDetails[] = [sampleWithRequiredData];
        expectedResult = service.addTransferDetailsToCollectionIfMissing(transferDetailsCollection, ...transferDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const transferDetails: ITransferDetails = sampleWithRequiredData;
        const transferDetails2: ITransferDetails = sampleWithPartialData;
        expectedResult = service.addTransferDetailsToCollectionIfMissing([], transferDetails, transferDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(transferDetails);
        expect(expectedResult).toContain(transferDetails2);
      });

      it('should accept null and undefined values', () => {
        const transferDetails: ITransferDetails = sampleWithRequiredData;
        expectedResult = service.addTransferDetailsToCollectionIfMissing([], null, transferDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(transferDetails);
      });

      it('should return initial array if no TransferDetails is added', () => {
        const transferDetailsCollection: ITransferDetails[] = [sampleWithRequiredData];
        expectedResult = service.addTransferDetailsToCollectionIfMissing(transferDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(transferDetailsCollection);
      });
    });

    describe('compareTransferDetails', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTransferDetails(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTransferDetails(entity1, entity2);
        const compareResult2 = service.compareTransferDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTransferDetails(entity1, entity2);
        const compareResult2 = service.compareTransferDetails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTransferDetails(entity1, entity2);
        const compareResult2 = service.compareTransferDetails(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
