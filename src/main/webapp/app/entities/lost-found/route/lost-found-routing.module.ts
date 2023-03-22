import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LostFoundComponent } from '../list/lost-found.component';
import { LostFoundDetailComponent } from '../detail/lost-found-detail.component';
import { LostFoundUpdateComponent } from '../update/lost-found-update.component';
import { LostFoundRoutingResolveService } from './lost-found-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const lostFoundRoute: Routes = [
  {
    path: '',
    component: LostFoundComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LostFoundDetailComponent,
    resolve: {
      lostFound: LostFoundRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LostFoundUpdateComponent,
    resolve: {
      lostFound: LostFoundRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LostFoundUpdateComponent,
    resolve: {
      lostFound: LostFoundRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lostFoundRoute)],
  exports: [RouterModule],
})
export class LostFoundRoutingModule {}
