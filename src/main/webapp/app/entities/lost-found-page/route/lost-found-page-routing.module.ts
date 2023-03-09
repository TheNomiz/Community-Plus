import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LostFoundPageComponent } from '../list/lost-found-page.component';
import { LostFoundPageDetailComponent } from '../detail/lost-found-page-detail.component';
import { LostFoundPageUpdateComponent } from '../update/lost-found-page-update.component';
import { LostFoundPageRoutingResolveService } from './lost-found-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const lostFoundPageRoute: Routes = [
  {
    path: '',
    component: LostFoundPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LostFoundPageDetailComponent,
    resolve: {
      lostFoundPage: LostFoundPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LostFoundPageUpdateComponent,
    resolve: {
      lostFoundPage: LostFoundPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LostFoundPageUpdateComponent,
    resolve: {
      lostFoundPage: LostFoundPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lostFoundPageRoute)],
  exports: [RouterModule],
})
export class LostFoundPageRoutingModule {}
