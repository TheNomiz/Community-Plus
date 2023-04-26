import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  exports: [MatGridListModule, MatCardModule, MatToolbarModule, MatButtonModule],
})
export class MaterialExampleModule {}
