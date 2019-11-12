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
import { TypeaheadModule } from "ngx-bootstrap/typeahead";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ThemeModule } from "./@theme/theme.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { MainComponent } from "./neosound/components/main/main.component";
import { LoginComponent } from "./neosound/pages/auth/login/login.component";
import { DashboardComponent } from "./neosound/pages/dashboard/dashboard.component";
import { StopwordsComponent } from "./neosound/pages/dashboard/details/stopwords/stopwords.component";

import { CallsDashboardComponent } from "./neosound/pages/dashboard/calls-dashboard/calls-dashboard.component";
import { TextsDashboardComponent } from "./neosound/pages/dashboard/texts-dashboard/texts-dashboard.component";

import { SignupLinkComponent } from "./neosound/pages/auth/signup-link/signup-link.component";
import { SignupDetailedComponent } from "./neosound/pages/auth/signup-detailed/signup-detailed.component";
import { TermsComponent } from "./neosound/pages/auth/terms/terms.component";
import { ForgotPasswordComponent } from "./neosound/pages/auth/forgot-password/forgot-password.component";

import { UserDetailsComponent } from "./neosound/pages/admin/user-details/user-details.component";
import { QuickTestComponent } from "./neosound/pages/guest/quick-test/quick-test.component";
import { ResultsComponent } from "./neosound/pages/guest/results/results.component";
import { AccountDetailsComponent } from "./neosound/pages/user/account-details/account-details.component";
import { FilesListComponent } from "./neosound/pages/user/files-list/files-list.component";
import { TextFilesListComponent } from "./neosound/pages/user/text-files-list/text-files-list.component";
import { FileResultsComponent } from "./neosound/pages/user/file-results/file-results.component";
import { LandingComponent } from "./neosound/pages/landing/landing.component";
import { AdminDashboardComponent } from "./neosound/pages/admin/dashboard/dashboard.component";
import { OrganizationSettingsComponent } from "./neosound/pages/admin/organisation-settings/organization-settings.component";
import { KeywordsComponent } from "./neosound/pages/admin/organisation-settings/components/keywords/keywords.component";
import { SensitiveDataComponent } from "./neosound/pages/admin/organisation-settings/components/sensitive-data/sensitive-data.component";

import { AuthGuard } from "./neosound/shared/auth-guard";
import { CanDeactivateGuard } from "./neosound/shared/can-deactivate";

import { AboutComponent } from "./neosound/pages/about/about.component";
import { MinutesSecondsPipe } from "./neosound/minutes-seconds.pipe";

import { FilesService } from "./neosound/services/files.service";
import { UploadService } from "./neosound/services/upload.service";
import { FilterService } from "./neosound/services/filter.service";
import { TextFilterService } from "./neosound/services/text-filter.service";
import { OrganizationSettingsService } from "./neosound/services/organization-settings.service";
import { PlayerService } from "./neosound/services/player.service";
import { AnalyticsService } from "./neosound/services/analytics.service";
import { MediaRecorderService } from "./neosound/services/media-recorder.service";
import { UsersService } from "./neosound/services/users.service";
import { RequestsHttpInterceptor } from "./neosound/shared/requests-http.interceptor";
import { NbPasswordAuthStrategy, NbAuthModule } from "@nebular/auth";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { TagCloudModule } from "angular-tag-cloud-module";
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
import { TagInputModule } from "ngx-chips";
const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true
  }
};

import { FileDropModule } from "ngx-file-drop";

import { PlayerComponent } from "./neosound/pages/guest/player-details/player/player.component";
import { PlayerDetailsComponent } from "./neosound/pages/guest/player-details/player-details.component";
import { TextLogComponent } from "./neosound/pages/guest/player-details/cards/text-log/text-log.component";
import { TextComplianceComponent } from "./neosound/pages/guest/player-details/cards/text-compliance/text-compliance.component";
import { FullTextComponent } from "./neosound/pages/guest/player-details/cards/full-text/full-text.component";
import { TextStopwordsComponent } from "./neosound/pages/guest/player-details/cards/text-stopwords/text-stopwords.component";
import { TextSankeyComponent } from "./neosound/pages/guest/player-details/cards/text-sankey/text-sankey.component";
import { TextKeywordsComponent } from "./neosound/pages/guest/player-details/cards/text-keywords/text-keywords.component";
import { TextTagCloudComponent } from "./neosound/pages/guest/player-details/cards/text-tag-cloud/text-tag-cloud.component";
import { TextHitsWordsComponent } from "./neosound/pages/guest/player-details/cards/text-hits-words/text-hits-words.component";

import { FileChartDataService } from "./neosound/pages/guest/player-details/services/file-chart-data.service";
import { FileResultService } from "./neosound/pages/guest/player-details/services/file-result.service";
import { FileInfoService } from "./neosound/pages/guest/player-details/services/file-info.service";
import { FileStatsService } from "./neosound/pages/guest/player-details/services/file-stats.service";

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
import { ChartPageComponent } from "./neosound/pages/charts/chart-page/chart-page.component";
import { CallsByDayChartLineComponent } from "./neosound/pages/charts/calls-by-day-chart-line/calls-by-day-chart-line.component";
import { TotalMinutesByDayChartLineComponent } from "./neosound/pages/charts/total-minutes-by-day-chart-line/total-minutes-by-day-chart-line.component";
import { TotalMinutesChartBarComponent } from "./neosound/pages/charts/total-minutes-chart-bar/total-minutes-chart-bar.component";
import { TotalByQueriesChartPieComponent } from "./neosound/pages/charts/total-by-queries-chart-pie/total-by-queries-chart-pie.component";
import { TotalMinutesPlusBatchesChartBarComponent } from "./neosound/pages/charts/total-minutes-plus-batches-chart-bar/total-minutes-plus-batches-chart-bar.component";
import { KeywordsRadialTreeComponent } from "./neosound/pages/charts/keywords-radial-tree/keywords-radial-tree.component";
import { TagifyComponent } from "./neosound/components/tagify/angular-tagify.component";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    DashboardComponent,
    StopwordsComponent,
    SignupLinkComponent,
    SignupDetailedComponent,
    TermsComponent,
    ForgotPasswordComponent,
    PlayerComponent,
    TagifyComponent,
    UserDetailsComponent,
    QuickTestComponent,
    ResultsComponent,
    AccountDetailsComponent,
    FilesListComponent,
    TextFilesListComponent,
    FileResultsComponent,
    LandingComponent,
    AdminDashboardComponent,
    OrganizationSettingsComponent,
    KeywordsComponent,
    SensitiveDataComponent,
    AboutComponent,
    PlayerDetailsComponent,
    TextLogComponent,
    TextComplianceComponent,
    TextStopwordsComponent,
    TextSankeyComponent,
    TextKeywordsComponent,
    TextTagCloudComponent,
    TextHitsWordsComponent,
    FullTextComponent,
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
    KeywordsRadialTreeComponent,
    CallsDashboardComponent,
    TextsDashboardComponent,
    TagifyComponent
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
    TypeaheadModule.forRoot(),
    ButtonsModule.forRoot(),

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),

    FileDropModule,
    NgxChartsModule,
    BarChartModule,
    ToastrModule.forRoot(),
    NgDatepickerModule,
    NgxPaginationModule,
    TagInputModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: "de-de"
    },
    AuthGuard,
    CanDeactivateGuard,
    UsersService,
    FilesService,
    FilterService,
    FileChartDataService,
    FileInfoService,
    FileStatsService,
    FileResultService,
    UploadService,
    TextFilterService,
    OrganizationSettingsService,
    PlayerService,
    AnalyticsService,
    MediaRecorderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestsHttpInterceptor,
      multi: true
    },
    LanguageService,
    DataService
  ]
})
export class AppModule {}
