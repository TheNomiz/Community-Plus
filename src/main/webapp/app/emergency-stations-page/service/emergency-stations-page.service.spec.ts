import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmergencyStationsPage } from '../emergency-stations-page.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../emergency-stations-page.test-samples';

import { EmergencyStationsPageService } from './emergency-stations-page.service';

const requireRestSample: IEmergencyStationsPage = {
  ...sampleWithRequiredData,
};

describe('EmergencyStationsPage Service', () => {
  let service: EmergencyStationsPageService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmergencyStationsPage | IEmergencyStationsPage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmergencyStationsPageService);
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

    it('should create a EmergencyStationsPage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const emergencyStationsPage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(emergencyStationsPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EmergencyStationsPage', () => {
      const emergencyStationsPage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(emergencyStationsPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EmergencyStationsPage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EmergencyStationsPage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EmergencyStationsPage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEmergencyStationsPageToCollectionIfMissing', () => {
      it('should add a EmergencyStationsPage to an empty array', () => {
        const emergencyStationsPage: IEmergencyStationsPage = sampleWithRequiredData;
        expectedResult = service.addEmergencyStationsPageToCollectionIfMissing([], emergencyStationsPage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emergencyStationsPage);
      });

      it('should not add a EmergencyStationsPage to an array that contains it', () => {
        const emergencyStationsPage: IEmergencyStationsPage = sampleWithRequiredData;
        const emergencyStationsPageCollection: IEmergencyStationsPage[] = [
          {
            ...emergencyStationsPage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmergencyStationsPageToCollectionIfMissing(emergencyStationsPageCollection, emergencyStationsPage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EmergencyStationsPage to an array that doesn't contain it", () => {
        const emergencyStationsPage: IEmergencyStationsPage = sampleWithRequiredData;
        const emergencyStationsPageCollection: IEmergencyStationsPage[] = [sampleWithPartialData];
        expectedResult = service.addEmergencyStationsPageToCollectionIfMissing(emergencyStationsPageCollection, emergencyStationsPage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emergencyStationsPage);
      });

      it('should add only unique EmergencyStationsPage to an array', () => {
        const emergencyStationsPageArray: IEmergencyStationsPage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const emergencyStationsPageCollection: IEmergencyStationsPage[] = [sampleWithRequiredData];
        expectedResult = service.addEmergencyStationsPageToCollectionIfMissing(
          emergencyStationsPageCollection,
          ...emergencyStationsPageArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const emergencyStationsPage: IEmergencyStationsPage = sampleWithRequiredData;
        const emergencyStationsPage2: IEmergencyStationsPage = sampleWithPartialData;
        expectedResult = service.addEmergencyStationsPageToCollectionIfMissing([], emergencyStationsPage, emergencyStationsPage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emergencyStationsPage);
        expect(expectedResult).toContain(emergencyStationsPage2);
      });

      it('should accept null and undefined values', () => {
        const emergencyStationsPage: IEmergencyStationsPage = sampleWithRequiredData;
        expectedResult = service.addEmergencyStationsPageToCollectionIfMissing([], null, emergencyStationsPage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emergencyStationsPage);
      });

      it('should return initial array if no EmergencyStationsPage is added', () => {
        const emergencyStationsPageCollection: IEmergencyStationsPage[] = [sampleWithRequiredData];
        expectedResult = service.addEmergencyStationsPageToCollectionIfMissing(emergencyStationsPageCollection, undefined, null);
        expect(expectedResult).toEqual(emergencyStationsPageCollection);
      });
    });

    describe('compareEmergencyStationsPage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmergencyStationsPage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEmergencyStationsPage(entity1, entity2);
        const compareResult2 = service.compareEmergencyStationsPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEmergencyStationsPage(entity1, entity2);
        const compareResult2 = service.compareEmergencyStationsPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEmergencyStationsPage(entity1, entity2);
        const compareResult2 = service.compareEmergencyStationsPage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
