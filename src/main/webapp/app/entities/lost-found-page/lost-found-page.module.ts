import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LostFoundPageComponent } from './list/lost-found-page.component';
import { LostFoundPageDetailComponent } from './detail/lost-found-page-detail.component';
import { LostFoundPageUpdateComponent } from './update/lost-found-page-update.component';
import { LostFoundPageDeleteDialogComponent } from './delete/lost-found-page-delete-dialog.component';
import { LostFoundPageRoutingModule } from './route/lost-found-page-routing.module';

@NgModule({
  imports: [SharedModule, LostFoundPageRoutingModule],
  declarations: [LostFoundPageComponent, LostFoundPageDetailComponent, LostFoundPageUpdateComponent, LostFoundPageDeleteDialogComponent],
})
export class LostFoundPageModule {}
