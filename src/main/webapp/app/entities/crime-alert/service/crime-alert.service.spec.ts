import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICrimeAlert } from '../crime-alert.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../crime-alert.test-samples';

import { CrimeAlertService, RestCrimeAlert } from './crime-alert.service';

const requireRestSample: RestCrimeAlert = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('CrimeAlert Service', () => {
  let service: CrimeAlertService;
  let httpMock: HttpTestingController;
  let expectedResult: ICrimeAlert | ICrimeAlert[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CrimeAlertService);
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

    it('should create a CrimeAlert', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const crimeAlert = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(crimeAlert).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CrimeAlert', () => {
      const crimeAlert = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(crimeAlert).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CrimeAlert', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CrimeAlert', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CrimeAlert', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCrimeAlertToCollectionIfMissing', () => {
      it('should add a CrimeAlert to an empty array', () => {
        const crimeAlert: ICrimeAlert = sampleWithRequiredData;
        expectedResult = service.addCrimeAlertToCollectionIfMissing([], crimeAlert);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(crimeAlert);
      });

      it('should not add a CrimeAlert to an array that contains it', () => {
        const crimeAlert: ICrimeAlert = sampleWithRequiredData;
        const crimeAlertCollection: ICrimeAlert[] = [
          {
            ...crimeAlert,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCrimeAlertToCollectionIfMissing(crimeAlertCollection, crimeAlert);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CrimeAlert to an array that doesn't contain it", () => {
        const crimeAlert: ICrimeAlert = sampleWithRequiredData;
        const crimeAlertCollection: ICrimeAlert[] = [sampleWithPartialData];
        expectedResult = service.addCrimeAlertToCollectionIfMissing(crimeAlertCollection, crimeAlert);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(crimeAlert);
      });

      it('should add only unique CrimeAlert to an array', () => {
        const crimeAlertArray: ICrimeAlert[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const crimeAlertCollection: ICrimeAlert[] = [sampleWithRequiredData];
        expectedResult = service.addCrimeAlertToCollectionIfMissing(crimeAlertCollection, ...crimeAlertArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const crimeAlert: ICrimeAlert = sampleWithRequiredData;
        const crimeAlert2: ICrimeAlert = sampleWithPartialData;
        expectedResult = service.addCrimeAlertToCollectionIfMissing([], crimeAlert, crimeAlert2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(crimeAlert);
        expect(expectedResult).toContain(crimeAlert2);
      });

      it('should accept null and undefined values', () => {
        const crimeAlert: ICrimeAlert = sampleWithRequiredData;
        expectedResult = service.addCrimeAlertToCollectionIfMissing([], null, crimeAlert, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(crimeAlert);
      });

      it('should return initial array if no CrimeAlert is added', () => {
        const crimeAlertCollection: ICrimeAlert[] = [sampleWithRequiredData];
        expectedResult = service.addCrimeAlertToCollectionIfMissing(crimeAlertCollection, undefined, null);
        expect(expectedResult).toEqual(crimeAlertCollection);
      });
    });

    describe('compareCrimeAlert', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCrimeAlert(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCrimeAlert(entity1, entity2);
        const compareResult2 = service.compareCrimeAlert(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCrimeAlert(entity1, entity2);
        const compareResult2 = service.compareCrimeAlert(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCrimeAlert(entity1, entity2);
        const compareResult2 = service.compareCrimeAlert(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
