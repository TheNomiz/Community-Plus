import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEmergencyStationsPage } from '../emergency-stations-page.model';
import { EmergencyStationsPageService } from '../service/emergency-stations-page.service';

import { EmergencyStationsPageRoutingResolveService } from './emergency-stations-page-routing-resolve.service';

describe('EmergencyStationsPage routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EmergencyStationsPageRoutingResolveService;
  let service: EmergencyStationsPageService;
  let resultEmergencyStationsPage: IEmergencyStationsPage | null | undefined;

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
    routingResolveService = TestBed.inject(EmergencyStationsPageRoutingResolveService);
    service = TestBed.inject(EmergencyStationsPageService);
    resultEmergencyStationsPage = undefined;
  });

  describe('resolve', () => {
    it('should return IEmergencyStationsPage returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmergencyStationsPage = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEmergencyStationsPage).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmergencyStationsPage = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEmergencyStationsPage).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IEmergencyStationsPage>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEmergencyStationsPage = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEmergencyStationsPage).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
