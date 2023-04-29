import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmergencyStationsComponent } from './list/emergency-stations.component';
import { EmergencyStationsDetailComponent } from './detail/emergency-stations-detail.component';
import { EmergencyStationsUpdateComponent } from './update/emergency-stations-update.component';
import { EmergencyStationsDeleteDialogComponent } from './delete/emergency-stations-delete-dialog.component';
import { EmergencyStationsRoutingModule } from './route/emergency-stations-routing.module';
import { MapInputModule } from '../entities/mapInput.module';

@NgModule({
  imports: [SharedModule, EmergencyStationsRoutingModule, MapInputModule],
  declarations: [
    EmergencyStationsComponent,
    EmergencyStationsDetailComponent,
    EmergencyStationsUpdateComponent,
    EmergencyStationsDeleteDialogComponent,
  ],
})
export class EmergencyStationsModule {}
