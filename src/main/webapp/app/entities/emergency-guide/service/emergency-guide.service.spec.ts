import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmergencyGuide } from '../emergency-guide.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../emergency-guide.test-samples';

import { EmergencyGuideService } from './emergency-guide.service';

const requireRestSample: IEmergencyGuide = {
  ...sampleWithRequiredData,
};

describe('EmergencyGuide Service', () => {
  let service: EmergencyGuideService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmergencyGuide | IEmergencyGuide[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmergencyGuideService);
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

    it('should create a EmergencyGuide', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const emergencyGuide = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(emergencyGuide).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EmergencyGuide', () => {
      const emergencyGuide = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(emergencyGuide).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EmergencyGuide', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EmergencyGuide', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EmergencyGuide', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEmergencyGuideToCollectionIfMissing', () => {
      it('should add a EmergencyGuide to an empty array', () => {
        const emergencyGuide: IEmergencyGuide = sampleWithRequiredData;
        expectedResult = service.addEmergencyGuideToCollectionIfMissing([], emergencyGuide);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emergencyGuide);
      });

      it('should not add a EmergencyGuide to an array that contains it', () => {
        const emergencyGuide: IEmergencyGuide = sampleWithRequiredData;
        const emergencyGuideCollection: IEmergencyGuide[] = [
          {
            ...emergencyGuide,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmergencyGuideToCollectionIfMissing(emergencyGuideCollection, emergencyGuide);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EmergencyGuide to an array that doesn't contain it", () => {
        const emergencyGuide: IEmergencyGuide = sampleWithRequiredData;
        const emergencyGuideCollection: IEmergencyGuide[] = [sampleWithPartialData];
        expectedResult = service.addEmergencyGuideToCollectionIfMissing(emergencyGuideCollection, emergencyGuide);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emergencyGuide);
      });

      it('should add only unique EmergencyGuide to an array', () => {
        const emergencyGuideArray: IEmergencyGuide[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const emergencyGuideCollection: IEmergencyGuide[] = [sampleWithRequiredData];
        expectedResult = service.addEmergencyGuideToCollectionIfMissing(emergencyGuideCollection, ...emergencyGuideArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const emergencyGuide: IEmergencyGuide = sampleWithRequiredData;
        const emergencyGuide2: IEmergencyGuide = sampleWithPartialData;
        expectedResult = service.addEmergencyGuideToCollectionIfMissing([], emergencyGuide, emergencyGuide2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emergencyGuide);
        expect(expectedResult).toContain(emergencyGuide2);
      });

      it('should accept null and undefined values', () => {
        const emergencyGuide: IEmergencyGuide = sampleWithRequiredData;
        expectedResult = service.addEmergencyGuideToCollectionIfMissing([], null, emergencyGuide, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(emergencyGuide);
      });

      it('should return initial array if no EmergencyGuide is added', () => {
        const emergencyGuideCollection: IEmergencyGuide[] = [sampleWithRequiredData];
        expectedResult = service.addEmergencyGuideToCollectionIfMissing(emergencyGuideCollection, undefined, null);
        expect(expectedResult).toEqual(emergencyGuideCollection);
      });
    });

    describe('compareEmergencyGuide', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmergencyGuide(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEmergencyGuide(entity1, entity2);
        const compareResult2 = service.compareEmergencyGuide(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEmergencyGuide(entity1, entity2);
        const compareResult2 = service.compareEmergencyGuide(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEmergencyGuide(entity1, entity2);
        const compareResult2 = service.compareEmergencyGuide(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
