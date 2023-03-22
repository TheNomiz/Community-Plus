import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmergencyGuideComponent } from './list/emergency-guide.component';
import { EmergencyGuideDetailComponent } from './detail/emergency-guide-detail.component';
import { EmergencyGuideUpdateComponent } from './update/emergency-guide-update.component';
import { EmergencyGuideDeleteDialogComponent } from './delete/emergency-guide-delete-dialog.component';
import { EmergencyGuideRoutingModule } from './route/emergency-guide-routing.module';

@NgModule({
  imports: [SharedModule, EmergencyGuideRoutingModule],
  declarations: [
    EmergencyGuideComponent,
    EmergencyGuideDetailComponent,
    EmergencyGuideUpdateComponent,
    EmergencyGuideDeleteDialogComponent,
  ],
})
export class EmergencyGuideModule {}
