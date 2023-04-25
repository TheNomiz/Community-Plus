import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapInputComponent } from 'app/map-input/map-input.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [MapInputComponent],
  imports: [CommonModule, SharedModule],
  exports: [MapInputComponent],
})
export class MapInputModule {}
