import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmergencyStations } from '../emergency-stations-db.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../emergency-stations-db.test-samples';

import { EmergencyStationsDbService } from './emergency-stations-db.service';

const requireRestSample: IEmergencyStations = {
  ...sampleWithRequiredData,
};

describe('EmergencyStations Service', () => {
  let service: EmergencyStationsDbService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmergencyStations | IEmergencyStations[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmergencyStationsDbService);
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

    it('should create a EmergencyStations', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const emergencyStations = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(emergencyStations).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EmergencyStations', () => {
      const emergencyStations = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(emergencyStations).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EmergencyStations', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EmergencyStations', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EmergencyStations', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEmergencyStationsToCollectionIfMissing', () => {
      it('should add a EmergencyStations to an empty array', () => {
        const emergencyStations: IEmergencyStations = sampleWithRequiredData;
        expectedResult = service.addEmergencyStationsToCollectionIfMissing([], emergencyStations);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emergencyStations);
      });

      it('should not add a EmergencyStations to an array that contains it', () => {
        const emergencyStations: IEmergencyStations = sampleWithRequiredData;
        const emergencyStationsCollection: IEmergencyStations[] = [
          {
            ...emergencyStations,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmergencyStationsToCollectionIfMissing(emergencyStationsCollection, emergencyStations);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EmergencyStations to an array that doesn't contain it", () => {
        const emergencyStations: IEmergencyStations = sampleWithRequiredData;
        const emergencyStationsCollection: IEmergencyStations[] = [sampleWithPartialData];
        expectedResult = service.addEmergencyStationsToCollectionIfMissing(emergencyStationsCollection, emergencyStations);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emergencyStations);
      });

      it('should add only unique EmergencyStations to an array', () => {
        const emergencyStationsArray: IEmergencyStations[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const emergencyStationsCollection: IEmergencyStations[] = [sampleWithRequiredData];
        expectedResult = service.addEmergencyStationsToCollectionIfMissing(emergencyStationsCollection, ...emergencyStationsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const emergencyStations: IEmergencyStations = sampleWithRequiredData;
        const emergencyStations2: IEmergencyStations = sampleWithPartialData;
        expectedResult = service.addEmergencyStationsToCollectionIfMissing([], emergencyStations, emergencyStations2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emergencyStations);
        expect(expectedResult).toContain(emergencyStations2);
      });

      it('should accept null and undefined values', () => {
        const emergencyStations: IEmergencyStations = sampleWithRequiredData;
        expectedResult = service.addEmergencyStationsToCollectionIfMissing([], null, emergencyStations, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emergencyStations);
      });

      it('should return initial array if no EmergencyStations is added', () => {
        const emergencyStationsCollection: IEmergencyStations[] = [sampleWithRequiredData];
        expectedResult = service.addEmergencyStationsToCollectionIfMissing(emergencyStationsCollection, undefined, null);
        expect(expectedResult).toEqual(emergencyStationsCollection);
      });
    });

    describe('compareEmergencyStations', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmergencyStations(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEmergencyStations(entity1, entity2);
        const compareResult2 = service.compareEmergencyStations(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEmergencyStations(entity1, entity2);
        const compareResult2 = service.compareEmergencyStations(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEmergencyStations(entity1, entity2);
        const compareResult2 = service.compareEmergencyStations(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
