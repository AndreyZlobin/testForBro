import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';

import { SignupLinkComponent } from './pages/auth/signup-link/signup-link.component';
import { SignupDetailedComponent } from './pages/auth/signup-detailed/signup-detailed.component';
import { TermsComponent } from './pages/auth/terms/terms.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';

import { UserDetailsComponent } from './pages/admin/user-details/user-details.component';
import { QuickTestComponent } from './pages/guest/quick-test/quick-test.component';
import { ResultsComponent } from './pages/guest/results/results.component';
import { AccountDetailsComponent } from './pages/user/account-details/account-details.component';
import { FilesListComponent } from './pages/user/files-list/files-list.component';
import { FileResultsComponent } from './pages/user/file-results/file-results.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AuthGuard } from './shared/auth-guard';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  {
    path: 'auth',
    component: MainComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
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
        path: 'terms',
        component: TermsComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
    ]
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: QuickTestComponent
      },
    ]
  },
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: MainComponent,
    children: [
      {
        path: 'about',
        canActivate: [ AuthGuard ],
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
        path: 'guest/results',
        canActivate: [ AuthGuard ],
        component: ResultsComponent
      },
      {
        path: 'guest/quicktest',
        canActivate: [ AuthGuard ],
        component: QuickTestComponent
      },
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
