import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
// import { StompService, StompConfig } from '@stomp/ng2-stompjs';
import { RxStompService } from './rxstomp.service';
import { rxStompServiceFactory } from './rxstomp-service-factory';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CommunityComponent],
  imports: [CommonModule, CommunityRoutingModule, NgbCarouselModule, NgIf, FormsModule],
  providers: [
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
  ],
})
export class CommunityModule {}
