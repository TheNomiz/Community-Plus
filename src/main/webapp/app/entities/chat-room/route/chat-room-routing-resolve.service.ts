import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChatRoom } from '../chat-room.model';
import { ChatRoomService } from '../service/chat-room.service';

@Injectable({ providedIn: 'root' })
export class ChatRoomRoutingResolveService implements Resolve<IChatRoom | null> {
  constructor(protected service: ChatRoomService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChatRoom | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chatRoom: HttpResponse<IChatRoom>) => {
          if (chatRoom.body) {
            return of(chatRoom.body);
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
