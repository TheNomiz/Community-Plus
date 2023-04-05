import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { StompService, StompConfig } from '@stomp/ng2-stompjs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [CommunityComponent],
  imports: [CommonModule, CommunityRoutingModule, NgbCarouselModule, NgIf, MatCardModule, MatListModule],
  providers: [StompService, StompConfig],
})
export class CommunityModule {}
