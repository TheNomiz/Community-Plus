import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CrimeAlertComponent } from './list/crime-alert.component';
import { CrimeAlertDetailComponent } from './detail/crime-alert-detail.component';
import { CrimeAlertUpdateComponent } from './update/crime-alert-update.component';
import { CrimeAlertDeleteDialogComponent } from './delete/crime-alert-delete-dialog.component';
import { CrimeAlertRoutingModule } from './route/crime-alert-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MapInputComponent } from 'app/map-input/map-input.component';

@NgModule({
  imports: [SharedModule, CrimeAlertRoutingModule, MatProgressBarModule],
  declarations: [
    CrimeAlertComponent,
    CrimeAlertDetailComponent,
    CrimeAlertUpdateComponent,
    CrimeAlertDeleteDialogComponent,
    MapInputComponent,
  ],
})
export class CrimeAlertModule {}
