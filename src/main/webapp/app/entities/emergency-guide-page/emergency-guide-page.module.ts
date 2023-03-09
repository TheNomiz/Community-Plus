import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmergencyGuidePageComponent } from './list/emergency-guide-page.component';
import { EmergencyGuidePageDetailComponent } from './detail/emergency-guide-page-detail.component';
import { EmergencyGuidePageUpdateComponent } from './update/emergency-guide-page-update.component';
import { EmergencyGuidePageDeleteDialogComponent } from './delete/emergency-guide-page-delete-dialog.component';
import { EmergencyGuidePageRoutingModule } from './route/emergency-guide-page-routing.module';

@NgModule({
  imports: [SharedModule, EmergencyGuidePageRoutingModule],
  declarations: [
    EmergencyGuidePageComponent,
    EmergencyGuidePageDetailComponent,
    EmergencyGuidePageUpdateComponent,
    EmergencyGuidePageDeleteDialogComponent,
  ],
})
export class EmergencyGuidePageModule {}
