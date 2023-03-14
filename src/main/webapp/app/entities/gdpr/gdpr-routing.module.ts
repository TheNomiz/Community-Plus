import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GdprComponent } from './gdpr.component';

const routes: Routes = [{ path: '', component: GdprComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GdprRoutingModule {}
