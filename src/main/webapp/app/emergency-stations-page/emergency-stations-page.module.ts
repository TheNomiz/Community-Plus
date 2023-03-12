import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmergencyStationsPageComponent } from './list/emergency-stations-page.component';
import { EmergencyStationsPageDetailComponent } from './detail/emergency-stations-page-detail.component';
import { EmergencyStationsPageUpdateComponent } from './update/emergency-stations-page-update.component';
import { EmergencyStationsPageDeleteDialogComponent } from './delete/emergency-stations-page-delete-dialog.component';
import { EmergencyStationsPageRoutingModule } from './route/emergency-stations-page-routing.module';

@NgModule({
  imports: [SharedModule, EmergencyStationsPageRoutingModule],
  declarations: [
    EmergencyStationsPageComponent,
    EmergencyStationsPageDetailComponent,
    EmergencyStationsPageUpdateComponent,
    EmergencyStationsPageDeleteDialogComponent,
  ],
})
export class EmergencyStationsPageModule {}
