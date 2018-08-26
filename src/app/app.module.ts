import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthenticationModule } from './shared';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { DataService } from './shared';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
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

import {FilesService} from './services/files.service';
import {UsersService} from './services/users.service';
import { AuthService } from './services/auth.service';
import { RequestsHttpInterceptor } from './shared/requests-http.interceptor';
import { LandingComponent } from './pages/landing/landing.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AuthGuard } from './shared/auth-guard';
import { AboutComponent } from './pages/about/about.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthenticationModule,
    AppRoutingModule,
    CommonModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    DashboardComponent,
    SignupLinkComponent,
    SignupDetailedComponent,
    TermsComponent,
    ForgotPasswordComponent,
    UserDetailsComponent,
    QuickTestComponent,
    ResultsComponent,
    AccountDetailsComponent,
    FilesListComponent,
    FileResultsComponent,
    LandingComponent,
    AdminDashboardComponent,
    AboutComponent,
  ],
  providers: [
    AuthGuard,
    DataService,
    UsersService,
    FilesService,
    AuthService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: RequestsHttpInterceptor,
        multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
