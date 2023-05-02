import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AboutusComponent } from './aboutus/aboutus.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { FaqsComponent } from './faqs/faqs.component';
import { EmergencyGuideComponent } from './entities/emergency-guide/list/emergency-guide.component';

@NgModule({
  imports: [
    RouterModule.forRoot([{ path: 'crisis-list', component: EmergencyGuideComponent }]),
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'about-us',
          component: AboutusComponent,
        },
        {
          path: 'privacy-policy',
          component: PrivacypolicyComponent,
        },
        {
          path: 'terms-and-conditions',
          component: TermsandconditionsComponent,
        },
        {
          path: 'accessibility',
          component: AccessibilityComponent,
        },
        {
          path: 'faqs',
          component: FaqsComponent,
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
