import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'crime-alert',
        data: { pageTitle: 'teamprojectApp.crimeAlert.home.title' },
        loadChildren: () => import('./crime-alert/crime-alert.module').then(m => m.CrimeAlertModule),
      },
      {
        path: 'business',
        data: { pageTitle: 'teamprojectApp.business.home.title' },
        loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
      },
      {
        path: 'event',
        data: { pageTitle: 'teamprojectApp.event.home.title' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      {
        path: 'chat-room',
        data: { pageTitle: 'teamprojectApp.chatRoom.home.title' },
        loadChildren: () => import('./chat-room/chat-room.module').then(m => m.ChatRoomModule),
      },
      {
        path: 'chat-message',
        data: { pageTitle: 'teamprojectApp.chatMessage.home.title' },
        loadChildren: () => import('./chat-message/chat-message.module').then(m => m.ChatMessageModule),
      },
      {
        path: 'user-profile',
        data: { pageTitle: 'teamprojectApp.userProfile.home.title' },
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
