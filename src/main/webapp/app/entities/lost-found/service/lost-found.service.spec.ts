import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ILostFound } from '../lost-found.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../lost-found.test-samples';

import { LostFoundService, RestLostFound } from './lost-found.service';

const requireRestSample: RestLostFound = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('LostFound Service', () => {
  let service: LostFoundService;
  let httpMock: HttpTestingController;
  let expectedResult: ILostFound | ILostFound[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LostFoundService);
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

    it('should create a LostFound', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const lostFound = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(lostFound).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LostFound', () => {
      const lostFound = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(lostFound).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LostFound', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LostFound', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LostFound', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLostFoundToCollectionIfMissing', () => {
      it('should add a LostFound to an empty array', () => {
        const lostFound: ILostFound = sampleWithRequiredData;
        expectedResult = service.addLostFoundToCollectionIfMissing([], lostFound);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lostFound);
      });

      it('should not add a LostFound to an array that contains it', () => {
        const lostFound: ILostFound = sampleWithRequiredData;
        const lostFoundCollection: ILostFound[] = [
          {
            ...lostFound,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLostFoundToCollectionIfMissing(lostFoundCollection, lostFound);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LostFound to an array that doesn't contain it", () => {
        const lostFound: ILostFound = sampleWithRequiredData;
        const lostFoundCollection: ILostFound[] = [sampleWithPartialData];
        expectedResult = service.addLostFoundToCollectionIfMissing(lostFoundCollection, lostFound);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lostFound);
      });

      it('should add only unique LostFound to an array', () => {
        const lostFoundArray: ILostFound[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const lostFoundCollection: ILostFound[] = [sampleWithRequiredData];
        expectedResult = service.addLostFoundToCollectionIfMissing(lostFoundCollection, ...lostFoundArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const lostFound: ILostFound = sampleWithRequiredData;
        const lostFound2: ILostFound = sampleWithPartialData;
        expectedResult = service.addLostFoundToCollectionIfMissing([], lostFound, lostFound2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lostFound);
        expect(expectedResult).toContain(lostFound2);
      });

      it('should accept null and undefined values', () => {
        const lostFound: ILostFound = sampleWithRequiredData;
        expectedResult = service.addLostFoundToCollectionIfMissing([], null, lostFound, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lostFound);
      });

      it('should return initial array if no LostFound is added', () => {
        const lostFoundCollection: ILostFound[] = [sampleWithRequiredData];
        expectedResult = service.addLostFoundToCollectionIfMissing(lostFoundCollection, undefined, null);
        expect(expectedResult).toEqual(lostFoundCollection);
      });
    });

    describe('compareLostFound', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLostFound(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLostFound(entity1, entity2);
        const compareResult2 = service.compareLostFound(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLostFound(entity1, entity2);
        const compareResult2 = service.compareLostFound(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLostFound(entity1, entity2);
        const compareResult2 = service.compareLostFound(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
