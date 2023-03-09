import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEmergencyGuidePage } from '../emergency-guide-page.model';
import { EmergencyGuidePageService } from '../service/emergency-guide-page.service';

import { EmergencyGuidePageRoutingResolveService } from './emergency-guide-page-routing-resolve.service';

describe('EmergencyGuidePage routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EmergencyGuidePageRoutingResolveService;
  let service: EmergencyGuidePageService;
  let resultEmergencyGuidePage: IEmergencyGuidePage | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(EmergencyGuidePageRoutingResolveService);
    service = TestBed.inject(EmergencyGuidePageService);
    resultEmergencyGuidePage = undefined;
  });

  describe('resolve', () => {
    it('should return IEmergencyGuidePage returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmergencyGuidePage = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEmergencyGuidePage).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmergencyGuidePage = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEmergencyGuidePage).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IEmergencyGuidePage>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmergencyGuidePage = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEmergencyGuidePage).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
