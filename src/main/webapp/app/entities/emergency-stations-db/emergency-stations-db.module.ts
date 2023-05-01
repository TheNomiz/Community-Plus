import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmergencyStationsDbComponent } from './list/emergency-stations-db.component';
import { EmergencyStationsDbDetailComponent } from './detail/emergency-stations-db-detail.component';
import { EmergencyStationsDbUpdateComponent } from './update/emergency-stations-db-update.component';
import { EmergencyStationsDbDeleteDialogComponent } from './delete/emergency-stations-db-delete-dialog.component';
import { EmergencyStationsDbRoutingModule } from './route/emergency-stations-db-routing.module';
import { MapInputModule } from '../mapInput.module';

@NgModule({
  imports: [SharedModule, EmergencyStationsDbRoutingModule, MapInputModule],
  declarations: [
    EmergencyStationsDbComponent,
    EmergencyStationsDbDetailComponent,
    EmergencyStationsDbUpdateComponent,
    EmergencyStationsDbDeleteDialogComponent,
  ],
})
export class EmergencyStationsDbModule {}
