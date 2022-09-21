import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITransferRecieved } from '../transfer-recieved.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../transfer-recieved.test-samples';

import { TransferRecievedService, RestTransferRecieved } from './transfer-recieved.service';

const requireRestSample: RestTransferRecieved = {
  ...sampleWithRequiredData,
  transferDate: sampleWithRequiredData.transferDate?.toJSON(),
};

describe('TransferRecieved Service', () => {
  let service: TransferRecievedService;
  let httpMock: HttpTestingController;
  let expectedResult: ITransferRecieved | ITransferRecieved[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TransferRecievedService);
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

    it('should create a TransferRecieved', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const transferRecieved = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(transferRecieved).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TransferRecieved', () => {
      const transferRecieved = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(transferRecieved).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TransferRecieved', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TransferRecieved', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TransferRecieved', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTransferRecievedToCollectionIfMissing', () => {
      it('should add a TransferRecieved to an empty array', () => {
        const transferRecieved: ITransferRecieved = sampleWithRequiredData;
        expectedResult = service.addTransferRecievedToCollectionIfMissing([], transferRecieved);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(transferRecieved);
      });

      it('should not add a TransferRecieved to an array that contains it', () => {
        const transferRecieved: ITransferRecieved = sampleWithRequiredData;
        const transferRecievedCollection: ITransferRecieved[] = [
          {
            ...transferRecieved,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTransferRecievedToCollectionIfMissing(transferRecievedCollection, transferRecieved);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TransferRecieved to an array that doesn't contain it", () => {
        const transferRecieved: ITransferRecieved = sampleWithRequiredData;
        const transferRecievedCollection: ITransferRecieved[] = [sampleWithPartialData];
        expectedResult = service.addTransferRecievedToCollectionIfMissing(transferRecievedCollection, transferRecieved);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(transferRecieved);
      });

      it('should add only unique TransferRecieved to an array', () => {
        const transferRecievedArray: ITransferRecieved[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const transferRecievedCollection: ITransferRecieved[] = [sampleWithRequiredData];
        expectedResult = service.addTransferRecievedToCollectionIfMissing(transferRecievedCollection, ...transferRecievedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const transferRecieved: ITransferRecieved = sampleWithRequiredData;
        const transferRecieved2: ITransferRecieved = sampleWithPartialData;
        expectedResult = service.addTransferRecievedToCollectionIfMissing([], transferRecieved, transferRecieved2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(transferRecieved);
        expect(expectedResult).toContain(transferRecieved2);
      });

      it('should accept null and undefined values', () => {
        const transferRecieved: ITransferRecieved = sampleWithRequiredData;
        expectedResult = service.addTransferRecievedToCollectionIfMissing([], null, transferRecieved, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(transferRecieved);
      });

      it('should return initial array if no TransferRecieved is added', () => {
        const transferRecievedCollection: ITransferRecieved[] = [sampleWithRequiredData];
        expectedResult = service.addTransferRecievedToCollectionIfMissing(transferRecievedCollection, undefined, null);
        expect(expectedResult).toEqual(transferRecievedCollection);
      });
    });

    describe('compareTransferRecieved', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTransferRecieved(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTransferRecieved(entity1, entity2);
        const compareResult2 = service.compareTransferRecieved(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTransferRecieved(entity1, entity2);
        const compareResult2 = service.compareTransferRecieved(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTransferRecieved(entity1, entity2);
        const compareResult2 = service.compareTransferRecieved(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
