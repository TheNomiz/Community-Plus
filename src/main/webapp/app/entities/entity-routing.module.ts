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
        path: 'emergency-guide-page',
        data: { pageTitle: 'teamprojectApp.emergencyGuidePage.home.title' },
        loadChildren: () => import('./emergency-guide-page/emergency-guide-page.module').then(m => m.EmergencyGuidePageModule),
      },
      {
        path: 'emergency-stations-page',
        data: { pageTitle: 'teamprojectApp.emergencyStationsPage.home.title' },
        loadChildren: () =>
          import('../emergency-stations-page-OLD/emergency-stations-page.module').then(m => m.EmergencyStationsPageModule),
      },
      {
        path: 'community',
        loadChildren: () => import('./community/community.module').then(m => m.CommunityModule),
      },
      {
        path: 'gdpr',
        loadChildren: () => import('./gdpr/gdpr.module').then(m => m.GdprModule),
      },
      {
        path: 'user-profile',
        data: { pageTitle: 'teamprojectApp.userProfile.home.title' },
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
      },
      {
        path: 'emergency-guide',
        data: { pageTitle: 'teamprojectApp.emergencyGuide.home.title' },
        loadChildren: () => import('./emergency-guide/emergency-guide.module').then(m => m.EmergencyGuideModule),
      },
      {
        path: 'emergency-stations',
        data: { pageTitle: 'teamprojectApp.emergencyStations.home.title' },
        loadChildren: () => import('../emergency-stations/emergency-stations.module').then(m => m.EmergencyStationsModule),
      },
      {
        path: 'lost-found',
        data: { pageTitle: 'teamprojectApp.lostFound.home.title' },
        loadChildren: () => import('./lost-found/lost-found.module').then(m => m.LostFoundModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'teamprojectApp.comment.home.title' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
