import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { registerLocaleData } from '@angular/common';
import localGermany from '@angular/common/locales/de';
import localGermanyExtra from '@angular/common/locales/extra/de';
registerLocaleData(localGermany, localGermanyExtra);

import { LoginComponent } from './neosound/pages/auth/login/login.component';
import { DashboardComponent } from './neosound/pages/dashboard/dashboard.component';
import { MainComponent } from './neosound/components/main/main.component';

import { SignupLinkComponent } from './neosound/pages/auth/signup-link/signup-link.component';
import { SignupDetailedComponent } from './neosound/pages/auth/signup-detailed/signup-detailed.component';
import { TermsComponent } from './neosound/pages/auth/terms/terms.component';
import { ForgotPasswordComponent } from './neosound/pages/auth/forgot-password/forgot-password.component';

import { UserDetailsComponent } from './neosound/pages/admin/user-details/user-details.component';
import { QuickTestComponent } from './neosound/pages/guest/quick-test/quick-test.component';
import { ResultsComponent } from './neosound/pages/guest/results/results.component';
import { AccountDetailsComponent } from './neosound/pages/user/account-details/account-details.component';
import { FilesListComponent } from './neosound/pages/user/files-list/files-list.component';
import { FileResultsComponent } from './neosound/pages/user/file-results/file-results.component';
import { LandingComponent } from './neosound/pages/landing/landing.component';
import { AdminDashboardComponent } from './neosound/pages/admin/dashboard/dashboard.component';
import { AuthGuard } from './neosound/shared/auth-guard';
import { AboutComponent } from './neosound/pages/about/about.component';

import {PagesComponent} from './pages/pages.component';
import { PlayerDetailsComponent } from './neosound/pages/guest/player-details/player-details.component';
import { ApiPageComponent } from './neosound/pages/user/api-page/api-page.component';
import { PageNotFoundComponent } from './neosound/pages/page-not-found/page-not-found.component';
import { BatchListComponent } from './neosound/pages/user/batch-list/batch-list.component';
import { BatchDetailsComponent } from './neosound/pages/user/batch-details/batch-details.component';

const routes: Routes = [
  { path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule' },
  {
    path: '',
    // canActivate: [ AuthGuard ],
    component: MainComponent,
    children: [
      {
        path: 'home',
        canActivate: [ AuthGuard ],
        component: DashboardComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'admin',
        canActivate: [ AuthGuard ],
        component: AdminDashboardComponent
      },
      {
        path: 'admin/user/:id',
        canActivate: [ AuthGuard ],
        component: UserDetailsComponent
      },
      {
        path: 'user/details',
        canActivate: [ AuthGuard ],
        component: AccountDetailsComponent
      },
      {
        path: 'user/files',
        canActivate: [ AuthGuard ],
        component: FilesListComponent
      },
      {
        path: 'user/files/reload',
        data: { reload: true },
        canActivate: [ AuthGuard ],
        component: FilesListComponent
      },
      {
        path: 'file/:batchid/:filename',
        canActivate: [ AuthGuard ],
        component: PlayerDetailsComponent
      },
      {
        path: 'user/result',
        canActivate: [ AuthGuard ],
        component: FileResultsComponent
      },
      {
        path: 'user/result/:id',
        canActivate: [ AuthGuard ],
        component: FileResultsComponent
      },
      {
        path: 'user/batch',
        canActivate: [ AuthGuard ],
        component: BatchListComponent,
      },
      {
        path: 'user/batch/:id',
        canActivate: [ AuthGuard ],
        component: BatchDetailsComponent,
      },
      {
        path: 'user/api',
        canActivate: [ AuthGuard ],
        component: ApiPageComponent
      },
      {
        path: 'guest/results',
        canActivate: [ AuthGuard ],
        component: ResultsComponent
      },
      {
        path: 'guest/quicktest',
        canActivate: [ AuthGuard ],
        component: QuickTestComponent
      },
      {
        path: 'guest/player-details',
        canActivate: [ AuthGuard ],
        component: PlayerDetailsComponent
      },
      {
        path: 'terms',
        component: TermsComponent
      },
      {
        path: '',
        canActivate: [ AuthGuard ],
        component: DashboardComponent,
      },
    ]
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'sign-up-link',
        component: SignupLinkComponent
      },
      {
        path: 'sign-up',
        component: SignupDetailedComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
      {
        path: '404',
        component: PageNotFoundComponent,
      },
    ],
  },
  // { path: '**', redirectTo: 'guest/quicktest' },
  {
    path: '**',
    component: MainComponent,
    children: [
      { path: '', component: PageNotFoundComponent, data: { error: 404 }, canActivate: [AuthGuard] },
    ],
  },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
