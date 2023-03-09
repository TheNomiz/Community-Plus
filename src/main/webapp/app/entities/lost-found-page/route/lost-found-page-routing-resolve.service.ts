import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILostFoundPage } from '../lost-found-page.model';
import { LostFoundPageService } from '../service/lost-found-page.service';

@Injectable({ providedIn: 'root' })
export class LostFoundPageRoutingResolveService implements Resolve<ILostFoundPage | null> {
  constructor(protected service: LostFoundPageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILostFoundPage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lostFoundPage: HttpResponse<ILostFoundPage>) => {
          if (lostFoundPage.body) {
            return of(lostFoundPage.body);
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
