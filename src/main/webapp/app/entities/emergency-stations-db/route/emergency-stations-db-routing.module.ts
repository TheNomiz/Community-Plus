import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmergencyStationsDbComponent } from '../list/emergency-stations-db.component';
import { EmergencyStationsDbDetailComponent } from '../detail/emergency-stations-db-detail.component';
import { EmergencyStationsDbUpdateComponent } from '../update/emergency-stations-db-update.component';
import { EmergencyStationsDbRoutingResolveService } from './emergency-stations-db-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const emergencyStationsRoute: Routes = [
  {
    path: '',
    component: EmergencyStationsDbComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmergencyStationsDbDetailComponent,
    resolve: {
      emergencyStations: EmergencyStationsDbRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmergencyStationsDbUpdateComponent,
    resolve: {
      emergencyStations: EmergencyStationsDbRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmergencyStationsDbUpdateComponent,
    resolve: {
      emergencyStations: EmergencyStationsDbRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emergencyStationsRoute)],
  exports: [RouterModule],
})
export class EmergencyStationsDbRoutingModule {}
