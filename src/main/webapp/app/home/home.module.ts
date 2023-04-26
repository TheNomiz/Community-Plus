import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE]), DragDropModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
