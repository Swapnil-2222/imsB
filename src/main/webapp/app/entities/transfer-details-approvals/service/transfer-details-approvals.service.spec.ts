import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITransferDetailsApprovals } from '../transfer-details-approvals.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../transfer-details-approvals.test-samples';

import { TransferDetailsApprovalsService, RestTransferDetailsApprovals } from './transfer-details-approvals.service';

const requireRestSample: RestTransferDetailsApprovals = {
  ...sampleWithRequiredData,
  approvalDate: sampleWithRequiredData.approvalDate?.toJSON(),
};

describe('TransferDetailsApprovals Service', () => {
  let service: TransferDetailsApprovalsService;
  let httpMock: HttpTestingController;
  let expectedResult: ITransferDetailsApprovals | ITransferDetailsApprovals[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TransferDetailsApprovalsService);
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

    it('should create a TransferDetailsApprovals', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const transferDetailsApprovals = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(transferDetailsApprovals).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TransferDetailsApprovals', () => {
      const transferDetailsApprovals = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(transferDetailsApprovals).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TransferDetailsApprovals', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TransferDetailsApprovals', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TransferDetailsApprovals', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTransferDetailsApprovalsToCollectionIfMissing', () => {
      it('should add a TransferDetailsApprovals to an empty array', () => {
        const transferDetailsApprovals: ITransferDetailsApprovals = sampleWithRequiredData;
        expectedResult = service.addTransferDetailsApprovalsToCollectionIfMissing([], transferDetailsApprovals);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(transferDetailsApprovals);
      });

      it('should not add a TransferDetailsApprovals to an array that contains it', () => {
        const transferDetailsApprovals: ITransferDetailsApprovals = sampleWithRequiredData;
        const transferDetailsApprovalsCollection: ITransferDetailsApprovals[] = [
          {
            ...transferDetailsApprovals,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTransferDetailsApprovalsToCollectionIfMissing(
          transferDetailsApprovalsCollection,
          transferDetailsApprovals
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TransferDetailsApprovals to an array that doesn't contain it", () => {
        const transferDetailsApprovals: ITransferDetailsApprovals = sampleWithRequiredData;
        const transferDetailsApprovalsCollection: ITransferDetailsApprovals[] = [sampleWithPartialData];
        expectedResult = service.addTransferDetailsApprovalsToCollectionIfMissing(
          transferDetailsApprovalsCollection,
          transferDetailsApprovals
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(transferDetailsApprovals);
      });

      it('should add only unique TransferDetailsApprovals to an array', () => {
        const transferDetailsApprovalsArray: ITransferDetailsApprovals[] = [
          sampleWithRequiredData,
          sampleWithPartialData,
          sampleWithFullData,
        ];
        const transferDetailsApprovalsCollection: ITransferDetailsApprovals[] = [sampleWithRequiredData];
        expectedResult = service.addTransferDetailsApprovalsToCollectionIfMissing(
          transferDetailsApprovalsCollection,
          ...transferDetailsApprovalsArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const transferDetailsApprovals: ITransferDetailsApprovals = sampleWithRequiredData;
        const transferDetailsApprovals2: ITransferDetailsApprovals = sampleWithPartialData;
        expectedResult = service.addTransferDetailsApprovalsToCollectionIfMissing([], transferDetailsApprovals, transferDetailsApprovals2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(transferDetailsApprovals);
        expect(expectedResult).toContain(transferDetailsApprovals2);
      });

      it('should accept null and undefined values', () => {
        const transferDetailsApprovals: ITransferDetailsApprovals = sampleWithRequiredData;
        expectedResult = service.addTransferDetailsApprovalsToCollectionIfMissing([], null, transferDetailsApprovals, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(transferDetailsApprovals);
      });

      it('should return initial array if no TransferDetailsApprovals is added', () => {
        const transferDetailsApprovalsCollection: ITransferDetailsApprovals[] = [sampleWithRequiredData];
        expectedResult = service.addTransferDetailsApprovalsToCollectionIfMissing(transferDetailsApprovalsCollection, undefined, null);
        expect(expectedResult).toEqual(transferDetailsApprovalsCollection);
      });
    });

    describe('compareTransferDetailsApprovals', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTransferDetailsApprovals(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTransferDetailsApprovals(entity1, entity2);
        const compareResult2 = service.compareTransferDetailsApprovals(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTransferDetailsApprovals(entity1, entity2);
        const compareResult2 = service.compareTransferDetailsApprovals(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTransferDetailsApprovals(entity1, entity2);
        const compareResult2 = service.compareTransferDetailsApprovals(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
