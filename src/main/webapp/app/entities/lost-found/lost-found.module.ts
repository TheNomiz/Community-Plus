import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LostFoundComponent } from './list/lost-found.component';
import { LostFoundDetailComponent } from './detail/lost-found-detail.component';
import { LostFoundUpdateComponent } from './update/lost-found-update.component';
import { LostFoundDeleteDialogComponent } from './delete/lost-found-delete-dialog.component';
import { LostFoundRoutingModule } from './route/lost-found-routing.module';

@NgModule({
  imports: [SharedModule, LostFoundRoutingModule],
  declarations: [LostFoundComponent, LostFoundDetailComponent, LostFoundUpdateComponent, LostFoundDeleteDialogComponent],
})
export class LostFoundModule {}
