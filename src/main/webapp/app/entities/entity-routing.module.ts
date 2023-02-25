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
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
