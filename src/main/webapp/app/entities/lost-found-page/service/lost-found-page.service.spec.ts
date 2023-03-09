import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILostFoundPage } from '../lost-found-page.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../lost-found-page.test-samples';

import { LostFoundPageService } from './lost-found-page.service';

const requireRestSample: ILostFoundPage = {
  ...sampleWithRequiredData,
};

describe('LostFoundPage Service', () => {
  let service: LostFoundPageService;
  let httpMock: HttpTestingController;
  let expectedResult: ILostFoundPage | ILostFoundPage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LostFoundPageService);
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

    it('should create a LostFoundPage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const lostFoundPage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(lostFoundPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LostFoundPage', () => {
      const lostFoundPage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(lostFoundPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LostFoundPage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LostFoundPage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LostFoundPage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLostFoundPageToCollectionIfMissing', () => {
      it('should add a LostFoundPage to an empty array', () => {
        const lostFoundPage: ILostFoundPage = sampleWithRequiredData;
        expectedResult = service.addLostFoundPageToCollectionIfMissing([], lostFoundPage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lostFoundPage);
      });

      it('should not add a LostFoundPage to an array that contains it', () => {
        const lostFoundPage: ILostFoundPage = sampleWithRequiredData;
        const lostFoundPageCollection: ILostFoundPage[] = [
          {
            ...lostFoundPage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLostFoundPageToCollectionIfMissing(lostFoundPageCollection, lostFoundPage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LostFoundPage to an array that doesn't contain it", () => {
        const lostFoundPage: ILostFoundPage = sampleWithRequiredData;
        const lostFoundPageCollection: ILostFoundPage[] = [sampleWithPartialData];
        expectedResult = service.addLostFoundPageToCollectionIfMissing(lostFoundPageCollection, lostFoundPage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lostFoundPage);
      });

      it('should add only unique LostFoundPage to an array', () => {
        const lostFoundPageArray: ILostFoundPage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const lostFoundPageCollection: ILostFoundPage[] = [sampleWithRequiredData];
        expectedResult = service.addLostFoundPageToCollectionIfMissing(lostFoundPageCollection, ...lostFoundPageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const lostFoundPage: ILostFoundPage = sampleWithRequiredData;
        const lostFoundPage2: ILostFoundPage = sampleWithPartialData;
        expectedResult = service.addLostFoundPageToCollectionIfMissing([], lostFoundPage, lostFoundPage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lostFoundPage);
        expect(expectedResult).toContain(lostFoundPage2);
      });

      it('should accept null and undefined values', () => {
        const lostFoundPage: ILostFoundPage = sampleWithRequiredData;
        expectedResult = service.addLostFoundPageToCollectionIfMissing([], null, lostFoundPage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lostFoundPage);
      });

      it('should return initial array if no LostFoundPage is added', () => {
        const lostFoundPageCollection: ILostFoundPage[] = [sampleWithRequiredData];
        expectedResult = service.addLostFoundPageToCollectionIfMissing(lostFoundPageCollection, undefined, null);
        expect(expectedResult).toEqual(lostFoundPageCollection);
      });
    });

    describe('compareLostFoundPage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLostFoundPage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLostFoundPage(entity1, entity2);
        const compareResult2 = service.compareLostFoundPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLostFoundPage(entity1, entity2);
        const compareResult2 = service.compareLostFoundPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLostFoundPage(entity1, entity2);
        const compareResult2 = service.compareLostFoundPage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
