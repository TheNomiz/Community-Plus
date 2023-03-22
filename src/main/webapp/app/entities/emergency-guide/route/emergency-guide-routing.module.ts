import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmergencyGuideComponent } from '../list/emergency-guide.component';
import { EmergencyGuideDetailComponent } from '../detail/emergency-guide-detail.component';
import { EmergencyGuideUpdateComponent } from '../update/emergency-guide-update.component';
import { EmergencyGuideRoutingResolveService } from './emergency-guide-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const emergencyGuideRoute: Routes = [
  {
    path: '',
    component: EmergencyGuideComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmergencyGuideDetailComponent,
    resolve: {
      emergencyGuide: EmergencyGuideRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmergencyGuideUpdateComponent,
    resolve: {
      emergencyGuide: EmergencyGuideRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmergencyGuideUpdateComponent,
    resolve: {
      emergencyGuide: EmergencyGuideRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emergencyGuideRoute)],
  exports: [RouterModule],
})
export class EmergencyGuideRoutingModule {}
