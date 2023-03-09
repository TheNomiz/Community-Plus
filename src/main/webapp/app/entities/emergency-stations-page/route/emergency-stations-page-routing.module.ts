import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmergencyStationsPageComponent } from '../list/emergency-stations-page.component';
import { EmergencyStationsPageDetailComponent } from '../detail/emergency-stations-page-detail.component';
import { EmergencyStationsPageUpdateComponent } from '../update/emergency-stations-page-update.component';
import { EmergencyStationsPageRoutingResolveService } from './emergency-stations-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const emergencyStationsPageRoute: Routes = [
  {
    path: '',
    component: EmergencyStationsPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmergencyStationsPageDetailComponent,
    resolve: {
      emergencyStationsPage: EmergencyStationsPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmergencyStationsPageUpdateComponent,
    resolve: {
      emergencyStationsPage: EmergencyStationsPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmergencyStationsPageUpdateComponent,
    resolve: {
      emergencyStationsPage: EmergencyStationsPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emergencyStationsPageRoute)],
  exports: [RouterModule],
})
export class EmergencyStationsPageRoutingModule {}
