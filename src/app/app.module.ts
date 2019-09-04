/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, LOCALE_ID } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ModalModule } from "ngx-bootstrap/modal";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ThemeModule } from "./@theme/theme.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { MainComponent } from "./neosound/components/main/main.component";
import { LoginComponent } from "./neosound/pages/auth/login/login.component";
import { DashboardComponent } from "./neosound/pages/dashboard/dashboard.component";

import { SignupLinkComponent } from "./neosound/pages/auth/signup-link/signup-link.component";
import { SignupDetailedComponent } from "./neosound/pages/auth/signup-detailed/signup-detailed.component";
import { TermsComponent } from "./neosound/pages/auth/terms/terms.component";
import { ForgotPasswordComponent } from "./neosound/pages/auth/forgot-password/forgot-password.component";

import { UserDetailsComponent } from "./neosound/pages/admin/user-details/user-details.component";
import { QuickTestComponent } from "./neosound/pages/guest/quick-test/quick-test.component";
import { ResultsComponent } from "./neosound/pages/guest/results/results.component";
import { AccountDetailsComponent } from "./neosound/pages/user/account-details/account-details.component";
import { FilesListComponent } from "./neosound/pages/user/files-list/files-list.component";
import { FileResultsComponent } from "./neosound/pages/user/file-results/file-results.component";
import { LandingComponent } from "./neosound/pages/landing/landing.component";
import { AdminDashboardComponent } from "./neosound/pages/admin/dashboard/dashboard.component";
import { OrganizationSettingsComponent } from "./neosound/pages/admin/organisation-settings/organization-settings.component";
import { AuthGuard } from "./neosound/shared/auth-guard";
import { AboutComponent } from "./neosound/pages/about/about.component";
import { MinutesSecondsPipe } from "./neosound/minutes-seconds.pipe";

import { FilesService } from "./neosound/services/files.service";
import { PlayerService } from "./neosound/services/player.service";
import { AnalyticsService } from "./neosound/services/analytics.service";
import { MediaRecorderService } from "./neosound/services/media-recorder.service";
import { UsersService } from "./neosound/services/users.service";
import { RequestsHttpInterceptor } from "./neosound/shared/requests-http.interceptor";
import { NbPasswordAuthStrategy, NbAuthModule } from "@nebular/auth";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { TagCloudModule } from 'angular-tag-cloud-module';
import {
  NgxChartsModule,
  PieChartModule,
  BarChartModule
} from "@swimlane/ngx-charts";
import {
  NbAuthComponent,
  NbLoginComponent,
  NbRegisterComponent,
  NbLogoutComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
  NbAuthBlockComponent
} from "@nebular/auth";
import { NbAlertModule, NbInputModule } from "@nebular/theme";
import { ToastrModule } from "ngx-toastr";
import { NgDatepickerModule } from "ng2-datepicker";
import { TagInputModule } from 'ngx-chips';

const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

import { FileDropModule } from "ngx-file-drop";
import { PlayerComponent } from "./neosound/pages/guest/player-details/player/player.component";
import { PlayerDetailsComponent } from "./neosound/pages/guest/player-details/player-details.component";
import { PieChartComponent } from "./neosound/components/pie-chart/pie-chart.component";
import { ApiPageComponent } from "./neosound/pages/user/api-page/api-page.component";
import { NgxEchartsModule } from "ngx-echarts";
import { ChartModule } from "angular2-chartjs";
import { PageNotFoundComponent } from "./neosound/pages/page-not-found/page-not-found.component";
import { LanguageService } from "./neosound/services/language.service";
import { NgxPaginationModule } from "ngx-pagination";
// import { ForbiddenPasswordDirective } from './neosound/directives/forbidden-password.directive';
import { IntervalDirective } from "./neosound/directives/interval.detective";
import { BatchListComponent } from "./neosound/pages/user/batch-list/batch-list.component";
import { BatchDetailsComponent } from "./neosound/pages/user/batch-details/batch-details.component";
import { DataService } from "./neosound/shared";
import { ChartPageComponent } from './neosound/pages/charts/chart-page/chart-page.component';
import { CallsByDayChartLineComponent } from './neosound/pages/charts/calls-by-day-chart-line/calls-by-day-chart-line.component';
import { TotalMinutesByDayChartLineComponent } from './neosound/pages/charts/total-minutes-by-day-chart-line/total-minutes-by-day-chart-line.component';
import { TotalMinutesChartBarComponent } from './neosound/pages/charts/total-minutes-chart-bar/total-minutes-chart-bar.component';
import { TotalByQueriesChartPieComponent } from './neosound/pages/charts/total-by-queries-chart-pie/total-by-queries-chart-pie.component';
import { TotalMinutesPlusBatchesChartBarComponent } from './neosound/pages/charts/total-minutes-plus-batches-chart-bar/total-minutes-plus-batches-chart-bar.component';

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
    PlayerComponent,

    UserDetailsComponent,
    QuickTestComponent,
    ResultsComponent,
    AccountDetailsComponent,
    FilesListComponent,
    FileResultsComponent,
    LandingComponent,
    AdminDashboardComponent,
    OrganizationSettingsComponent,
    AboutComponent,
    PlayerDetailsComponent,
    PieChartComponent,
    ApiPageComponent,
    PageNotFoundComponent,
    IntervalDirective,
    BatchListComponent,
    BatchDetailsComponent,
    ChartPageComponent,
    CallsByDayChartLineComponent,
    TotalMinutesByDayChartLineComponent,
    TotalMinutesChartBarComponent,
    TotalByQueriesChartPieComponent,
    TotalMinutesPlusBatchesChartBarComponent,
    // ForbiddenPasswordDirective,

    //ngx-admin
    //   NbAlertComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    NbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NgxEchartsModule,
    TagCloudModule,

    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),

    FileDropModule,
    // NgxChartsModule,
    // NgxEchartsModule,
    NgxChartsModule,
    // ChartModule,
    // PieChartModule,
    BarChartModule,
    ToastrModule.forRoot(),
    NgDatepickerModule,
    NgxPaginationModule,
    TagInputModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'de-de',
    },
    AuthGuard,
    UsersService,
    FilesService,
    PlayerService,
    AnalyticsService,
    MediaRecorderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestsHttpInterceptor,
      multi: true,
    },
    LanguageService,
    DataService,
  ],
})
export class AppModule {}
