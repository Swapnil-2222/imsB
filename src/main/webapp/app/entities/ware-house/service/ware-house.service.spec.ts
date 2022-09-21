import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWareHouse } from '../ware-house.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ware-house.test-samples';

import { WareHouseService } from './ware-house.service';

const requireRestSample: IWareHouse = {
  ...sampleWithRequiredData,
};

describe('WareHouse Service', () => {
  let service: WareHouseService;
  let httpMock: HttpTestingController;
  let expectedResult: IWareHouse | IWareHouse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WareHouseService);
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

    it('should create a WareHouse', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const wareHouse = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(wareHouse).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a WareHouse', () => {
      const wareHouse = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(wareHouse).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a WareHouse', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of WareHouse', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a WareHouse', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWareHouseToCollectionIfMissing', () => {
      it('should add a WareHouse to an empty array', () => {
        const wareHouse: IWareHouse = sampleWithRequiredData;
        expectedResult = service.addWareHouseToCollectionIfMissing([], wareHouse);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(wareHouse);
      });

      it('should not add a WareHouse to an array that contains it', () => {
        const wareHouse: IWareHouse = sampleWithRequiredData;
        const wareHouseCollection: IWareHouse[] = [
          {
            ...wareHouse,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWareHouseToCollectionIfMissing(wareHouseCollection, wareHouse);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a WareHouse to an array that doesn't contain it", () => {
        const wareHouse: IWareHouse = sampleWithRequiredData;
        const wareHouseCollection: IWareHouse[] = [sampleWithPartialData];
        expectedResult = service.addWareHouseToCollectionIfMissing(wareHouseCollection, wareHouse);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(wareHouse);
      });

      it('should add only unique WareHouse to an array', () => {
        const wareHouseArray: IWareHouse[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const wareHouseCollection: IWareHouse[] = [sampleWithRequiredData];
        expectedResult = service.addWareHouseToCollectionIfMissing(wareHouseCollection, ...wareHouseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const wareHouse: IWareHouse = sampleWithRequiredData;
        const wareHouse2: IWareHouse = sampleWithPartialData;
        expectedResult = service.addWareHouseToCollectionIfMissing([], wareHouse, wareHouse2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(wareHouse);
        expect(expectedResult).toContain(wareHouse2);
      });

      it('should accept null and undefined values', () => {
        const wareHouse: IWareHouse = sampleWithRequiredData;
        expectedResult = service.addWareHouseToCollectionIfMissing([], null, wareHouse, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(wareHouse);
      });

      it('should return initial array if no WareHouse is added', () => {
        const wareHouseCollection: IWareHouse[] = [sampleWithRequiredData];
        expectedResult = service.addWareHouseToCollectionIfMissing(wareHouseCollection, undefined, null);
        expect(expectedResult).toEqual(wareHouseCollection);
      });
    });

    describe('compareWareHouse', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWareHouse(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWareHouse(entity1, entity2);
        const compareResult2 = service.compareWareHouse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWareHouse(entity1, entity2);
        const compareResult2 = service.compareWareHouse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWareHouse(entity1, entity2);
        const compareResult2 = service.compareWareHouse(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
