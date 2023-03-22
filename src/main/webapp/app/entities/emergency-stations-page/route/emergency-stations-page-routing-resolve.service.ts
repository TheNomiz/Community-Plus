import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmergencyStationsPage } from '../emergency-stations-page.model';
import { EmergencyStationsPageService } from '../service/emergency-stations-page.service';

@Injectable({ providedIn: 'root' })
export class EmergencyStationsPageRoutingResolveService implements Resolve<IEmergencyStationsPage | null> {
  constructor(protected service: EmergencyStationsPageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmergencyStationsPage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((emergencyStationsPage: HttpResponse<IEmergencyStationsPage>) => {
          if (emergencyStationsPage.body) {
            return of(emergencyStationsPage.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
