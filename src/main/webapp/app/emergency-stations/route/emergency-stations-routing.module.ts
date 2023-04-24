import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmergencyStationsComponent } from '../list/emergency-stations.component';
import { EmergencyStationsDetailComponent } from '../detail/emergency-stations-detail.component';
import { EmergencyStationsUpdateComponent } from '../update/emergency-stations-update.component';
import { EmergencyStationsRoutingResolveService } from './emergency-stations-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const emergencyStationsRoute: Routes = [
  {
    path: '',
    component: EmergencyStationsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmergencyStationsDetailComponent,
    resolve: {
      emergencyStations: EmergencyStationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmergencyStationsUpdateComponent,
    resolve: {
      emergencyStations: EmergencyStationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmergencyStationsUpdateComponent,
    resolve: {
      emergencyStations: EmergencyStationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emergencyStationsRoute)],
  exports: [RouterModule],
})
export class EmergencyStationsRoutingModule {}
