import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmergencyStations } from '../emergency-stations.model';
import { EmergencyStationsService } from '../service/emergency-stations.service';

@Injectable({ providedIn: 'root' })
export class EmergencyStationsRoutingResolveService implements Resolve<IEmergencyStations | null> {
  constructor(protected service: EmergencyStationsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmergencyStations | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((emergencyStations: HttpResponse<IEmergencyStations>) => {
          if (emergencyStations.body) {
            return of(emergencyStations.body);
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
