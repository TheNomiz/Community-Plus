import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBusiness } from '../business.model';
import { BusinessService } from '../service/business.service';

@Injectable({ providedIn: 'root' })
export class BusinessRoutingResolveService implements Resolve<IBusiness | null> {
  constructor(protected service: BusinessService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBusiness | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((business: HttpResponse<IBusiness>) => {
          if (business.body) {
            return of(business.body);
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
