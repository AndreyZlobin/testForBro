import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicGuard, ProtectedGuard } from 'ngx-auth';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [ PublicGuard ],
    component: LoginComponent
  },
  {
    path: '',
    canActivate: [ ProtectedGuard ],
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [ ProtectedGuard ],
        component: DashboardComponent
      },
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
