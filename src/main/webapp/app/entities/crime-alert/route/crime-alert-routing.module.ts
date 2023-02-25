import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CrimeAlertComponent } from '../list/crime-alert.component';
import { CrimeAlertDetailComponent } from '../detail/crime-alert-detail.component';
import { CrimeAlertUpdateComponent } from '../update/crime-alert-update.component';
import { CrimeAlertRoutingResolveService } from './crime-alert-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const crimeAlertRoute: Routes = [
  {
    path: '',
    component: CrimeAlertComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CrimeAlertDetailComponent,
    resolve: {
      crimeAlert: CrimeAlertRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CrimeAlertUpdateComponent,
    resolve: {
      crimeAlert: CrimeAlertRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CrimeAlertUpdateComponent,
    resolve: {
      crimeAlert: CrimeAlertRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(crimeAlertRoute)],
  exports: [RouterModule],
})
export class CrimeAlertRoutingModule {}
