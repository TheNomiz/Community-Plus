import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmergencyGuidePage } from '../emergency-guide-page.model';
import { EmergencyGuidePageService } from '../service/emergency-guide-page.service';

@Injectable({ providedIn: 'root' })
export class EmergencyGuidePageRoutingResolveService implements Resolve<IEmergencyGuidePage | null> {
  constructor(protected service: EmergencyGuidePageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmergencyGuidePage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((emergencyGuidePage: HttpResponse<IEmergencyGuidePage>) => {
          if (emergencyGuidePage.body) {
            return of(emergencyGuidePage.body);
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
