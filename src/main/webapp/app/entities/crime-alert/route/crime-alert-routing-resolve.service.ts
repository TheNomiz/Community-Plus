import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICrimeAlert } from '../crime-alert.model';
import { CrimeAlertService } from '../service/crime-alert.service';

@Injectable({ providedIn: 'root' })
export class CrimeAlertRoutingResolveService implements Resolve<ICrimeAlert | null> {
  constructor(protected service: CrimeAlertService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICrimeAlert | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((crimeAlert: HttpResponse<ICrimeAlert>) => {
          if (crimeAlert.body) {
            return of(crimeAlert.body);
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
