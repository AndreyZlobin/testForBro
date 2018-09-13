/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MainComponent } from './neosound/components/main/main.component';
import { LoginComponent } from './neosound/pages/auth/login/login.component';
import { DashboardComponent } from './neosound/pages/dashboard/dashboard.component';

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
import { MinutesSecondsPipe } from './neosound/minutes-seconds.pipe';

import { FilesService } from './neosound/services/files.service';
import { MediaRecorderService } from './neosound/services/media-recorder.service';
import { UsersService } from './neosound/services/users.service';
import { RequestsHttpInterceptor } from './neosound/shared/requests-http.interceptor';
import { NbPasswordAuthStrategy, NbAuthModule } from '@nebular/auth';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbRegisterComponent,
  NbLogoutComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
  NbAuthBlockComponent,
} from '@nebular/auth';
import {
  NbAlertModule,
  NbInputModule,
} from '@nebular/theme';

const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

import { FileDropModule } from 'ngx-file-drop';

@NgModule({
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
      MinutesSecondsPipe,

      //ngx-admin
    //   NbAlertComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    // NbAuthModule.forRoot({
    //   strategies: [
    //     NbPasswordAuthStrategy.setup({
    //       name: 'name',
    //       baseEndpoint: 'https://oiwyrnx3ug.execute-api.eu-west-1.amazonaws.com/prod',
    //       token: {
    //         class: NbAuthJWTToken,

    //         key: 'token', // this parameter tells where to look for the token
    //       },
    //       login: {
    //         endpoint: '/loginUser',
    //         method: 'post',
    //       },
    //       register: {
    //         endpoint: '/auth/sign-up',
    //         method: 'post',
    //       },
    //       logout: {
    //         endpoint: '/auth/sign-out',
    //         method: 'post',
    //       },
    //       requestPass: {
    //         endpoint: '/auth/request-pass',
    //         method: 'post',
    //       },
    //       resetPass: {
    //         endpoint: '/auth/reset-pass',
    //         method: 'post',
    //       },
    //     }),
    //   ],
    //   forms: {
    //     login: formSetting,
    //     register: formSetting,
    //     requestPassword: formSetting,
    //     resetPassword: formSetting,
    //     logout: {
    //       redirectDelay: 0,
    //     },
    //   },
    // }),
    NbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,

    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),

    FileDropModule,
  ],
  bootstrap: [AppComponent],
  providers: [
      AuthGuard,
      UsersService,
      FilesService,
      MediaRecorderService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: RequestsHttpInterceptor,
        multi: true,
      }
  ],
})
export class AppModule {
}
