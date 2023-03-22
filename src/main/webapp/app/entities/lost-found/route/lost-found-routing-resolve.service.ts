import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILostFound } from '../lost-found.model';
import { LostFoundService } from '../service/lost-found.service';

@Injectable({ providedIn: 'root' })
export class LostFoundRoutingResolveService implements Resolve<ILostFound | null> {
  constructor(protected service: LostFoundService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILostFound | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lostFound: HttpResponse<ILostFound>) => {
          if (lostFound.body) {
            return of(lostFound.body);
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
