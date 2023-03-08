import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChatRoomComponent } from '../list/chat-room.component';
import { ChatRoomDetailComponent } from '../detail/chat-room-detail.component';
import { ChatRoomUpdateComponent } from '../update/chat-room-update.component';
import { ChatRoomRoutingResolveService } from './chat-room-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const chatRoomRoute: Routes = [
  {
    path: '',
    component: ChatRoomComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChatRoomDetailComponent,
    resolve: {
      chatRoom: ChatRoomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChatRoomUpdateComponent,
    resolve: {
      chatRoom: ChatRoomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChatRoomUpdateComponent,
    resolve: {
      chatRoom: ChatRoomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chatRoomRoute)],
  exports: [RouterModule],
})
export class ChatRoomRoutingModule {}
