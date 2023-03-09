import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmergencyGuidePageComponent } from '../list/emergency-guide-page.component';
import { EmergencyGuidePageDetailComponent } from '../detail/emergency-guide-page-detail.component';
import { EmergencyGuidePageUpdateComponent } from '../update/emergency-guide-page-update.component';
import { EmergencyGuidePageRoutingResolveService } from './emergency-guide-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const emergencyGuidePageRoute: Routes = [
  {
    path: '',
    component: EmergencyGuidePageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmergencyGuidePageDetailComponent,
    resolve: {
      emergencyGuidePage: EmergencyGuidePageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmergencyGuidePageUpdateComponent,
    resolve: {
      emergencyGuidePage: EmergencyGuidePageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmergencyGuidePageUpdateComponent,
    resolve: {
      emergencyGuidePage: EmergencyGuidePageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emergencyGuidePageRoute)],
  exports: [RouterModule],
})
export class EmergencyGuidePageRoutingModule {}
