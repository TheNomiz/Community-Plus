import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [CommunityComponent],
  imports: [CommonModule, CommunityRoutingModule, NgbCarouselModule, NgIf, LeafletModule],
})
export class CommunityModule {}
