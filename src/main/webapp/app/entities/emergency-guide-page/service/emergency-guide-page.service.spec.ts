import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmergencyGuidePage } from '../emergency-guide-page.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../emergency-guide-page.test-samples';

import { EmergencyGuidePageService } from './emergency-guide-page.service';

const requireRestSample: IEmergencyGuidePage = {
  ...sampleWithRequiredData,
};

describe('EmergencyGuidePage Service', () => {
  let service: EmergencyGuidePageService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmergencyGuidePage | IEmergencyGuidePage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmergencyGuidePageService);
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

    it('should create a EmergencyGuidePage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const emergencyGuidePage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(emergencyGuidePage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EmergencyGuidePage', () => {
      const emergencyGuidePage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(emergencyGuidePage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EmergencyGuidePage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EmergencyGuidePage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EmergencyGuidePage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEmergencyGuidePageToCollectionIfMissing', () => {
      it('should add a EmergencyGuidePage to an empty array', () => {
        const emergencyGuidePage: IEmergencyGuidePage = sampleWithRequiredData;
        expectedResult = service.addEmergencyGuidePageToCollectionIfMissing([], emergencyGuidePage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emergencyGuidePage);
      });

      it('should not add a EmergencyGuidePage to an array that contains it', () => {
        const emergencyGuidePage: IEmergencyGuidePage = sampleWithRequiredData;
        const emergencyGuidePageCollection: IEmergencyGuidePage[] = [
          {
            ...emergencyGuidePage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmergencyGuidePageToCollectionIfMissing(emergencyGuidePageCollection, emergencyGuidePage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EmergencyGuidePage to an array that doesn't contain it", () => {
        const emergencyGuidePage: IEmergencyGuidePage = sampleWithRequiredData;
        const emergencyGuidePageCollection: IEmergencyGuidePage[] = [sampleWithPartialData];
        expectedResult = service.addEmergencyGuidePageToCollectionIfMissing(emergencyGuidePageCollection, emergencyGuidePage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emergencyGuidePage);
      });

      it('should add only unique EmergencyGuidePage to an array', () => {
        const emergencyGuidePageArray: IEmergencyGuidePage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const emergencyGuidePageCollection: IEmergencyGuidePage[] = [sampleWithRequiredData];
        expectedResult = service.addEmergencyGuidePageToCollectionIfMissing(emergencyGuidePageCollection, ...emergencyGuidePageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const emergencyGuidePage: IEmergencyGuidePage = sampleWithRequiredData;
        const emergencyGuidePage2: IEmergencyGuidePage = sampleWithPartialData;
        expectedResult = service.addEmergencyGuidePageToCollectionIfMissing([], emergencyGuidePage, emergencyGuidePage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emergencyGuidePage);
        expect(expectedResult).toContain(emergencyGuidePage2);
      });

      it('should accept null and undefined values', () => {
        const emergencyGuidePage: IEmergencyGuidePage = sampleWithRequiredData;
        expectedResult = service.addEmergencyGuidePageToCollectionIfMissing([], null, emergencyGuidePage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emergencyGuidePage);
      });

      it('should return initial array if no EmergencyGuidePage is added', () => {
        const emergencyGuidePageCollection: IEmergencyGuidePage[] = [sampleWithRequiredData];
        expectedResult = service.addEmergencyGuidePageToCollectionIfMissing(emergencyGuidePageCollection, undefined, null);
        expect(expectedResult).toEqual(emergencyGuidePageCollection);
      });
    });

    describe('compareEmergencyGuidePage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmergencyGuidePage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEmergencyGuidePage(entity1, entity2);
        const compareResult2 = service.compareEmergencyGuidePage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEmergencyGuidePage(entity1, entity2);
        const compareResult2 = service.compareEmergencyGuidePage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEmergencyGuidePage(entity1, entity2);
        const compareResult2 = service.compareEmergencyGuidePage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
