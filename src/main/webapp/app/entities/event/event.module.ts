import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventComponent } from './list/event.component';
import { EventDetailComponent } from './detail/event-detail.component';
import { EventUpdateComponent } from './update/event-update.component';
import { EventDeleteDialogComponent } from './delete/event-delete-dialog.component';
import { EventRoutingModule } from './route/event-routing.module';
import { MapInputComponent } from 'app/map-input/map-input.component';

@NgModule({
  imports: [SharedModule, EventRoutingModule],
  declarations: [EventComponent, EventDetailComponent, EventUpdateComponent, EventDeleteDialogComponent, MapInputComponent],
})
export class EventModule {}
