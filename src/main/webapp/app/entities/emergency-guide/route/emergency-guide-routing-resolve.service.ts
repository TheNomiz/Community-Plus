import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmergencyGuide } from '../emergency-guide.model';
import { EmergencyGuideService } from '../service/emergency-guide.service';

@Injectable({ providedIn: 'root' })
export class EmergencyGuideRoutingResolveService implements Resolve<IEmergencyGuide | null> {
  constructor(protected service: EmergencyGuideService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmergencyGuide | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((emergencyGuide: HttpResponse<IEmergencyGuide>) => {
          if (emergencyGuide.body) {
            return of(emergencyGuide.body);
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
