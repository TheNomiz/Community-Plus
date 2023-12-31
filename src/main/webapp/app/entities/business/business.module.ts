import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BusinessComponent } from './list/business.component';
import { BusinessDetailComponent } from './detail/business-detail.component';
import { BusinessUpdateComponent } from './update/business-update.component';
import { BusinessDeleteDialogComponent } from './delete/business-delete-dialog.component';
import { BusinessRoutingModule } from './route/business-routing.module';
import { MapInputModule } from '../mapInput.module';

@NgModule({
  imports: [SharedModule, BusinessRoutingModule, MapInputModule],
  declarations: [BusinessComponent, BusinessDetailComponent, BusinessUpdateComponent, BusinessDeleteDialogComponent],
})
export class BusinessModule {}
