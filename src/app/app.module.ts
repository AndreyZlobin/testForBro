import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DragulaModule } from "ng2-dragula";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ModalModule } from "ngx-bootstrap/modal";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ThemeModule } from "./@theme/theme.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { MainComponent } from "./neosound/components/main/main.component";
import { LoginComponent } from "./neosound/pages/auth/login/login.component";
import { DashboardComponent } from "./neosound/pages/dashboard/dashboard.component";
import { StopwordsComponent } from "./neosound/pages/dashboard/details/stopwords/stopwords.component";

import { CardSpinnerComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/card-spinner/card-spinner.component";
import { CallsDashboardComponent } from "./neosound/pages/dashboard/calls-dashboard/calls-dashboard.component";
import { InfoBarComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/info-bar/info-bar.component";
import { NumberOfCallsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/number-of-calls/number-of-calls.component";
import { ProcessedCallsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/processed-calls/processed-calls.component";
import { PerformanceByAgentComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/performance-by-agent/performance-by-agent.component";
import { StopWordsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/stopwords/stopwords.component";
import { HitsStopwordsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/hits-stopwords/hits-stopwords.component";
import { TopicComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/topics/topics.component";
import { HitsTopicsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/hits-topics/hits-topics.component";
import { AssessmentByAgentComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/assessment-by-agent/assessment-by-agent.component";

import { MinutesStatsBatchesComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/minutes-stats-batches/minutes-stats-batchess.component";
import { MinutesStatsMinutesComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/minutes-stats-minutes/minutes-stats-minutes.component";
import { CallsByDayComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/calls-by-day/calls-by-day.component";
import { PopularWordsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/popular-words/popular-words.component";
import { FreqWordsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/freq-words/freq-words.component";
import { AverageSentimentsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/average-sentiments/average-sentiments.component";
import { CountSentimentsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/count-sentiments/count-sentiments.component";

import { SentimentalSankeyComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/sentimental-sankey/sentimental-sankey.component";
import { SentimentalTreeComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/sentiment-tree/sentiment-tree.component";
import { KeywordsPhrasesComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/keywords-phrases/keywords-phrases.component";
import { UploadInstructionsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/upload-instructions/upload-instructions.component";
import { QueriesChartComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/queries-chart/queries-chart.component";
import { SentimentStatsBatchesComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/sentiment-stats-batches/sentiment-stats-batches.component";
import { SentimentalOfCallsComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/sentimental-of-calls/sentimental-of-calls.component";
import { SentimentStatsDayComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/sentiment-stats-day/sentiment-stats-day.component";
import { SentimentalCallsByDayComponent } from "./neosound/pages/dashboard/calls-dashboard/cards/sentimental-calls-by-day/sentimental-calls-by-day.component";

import { TextsDashboardComponent } from "./neosound/pages/dashboard/texts-dashboard/texts-dashboard.component";

import { ApiCallsStatsService } from "./neosound/pages/dashboard/calls-dashboard/services/api-calls-stats.service";
import { ChartDataService } from "./neosound/pages/dashboard/calls-dashboard/services/chart-data.service";
import { DashboardFileStatsService } from "./neosound/pages/dashboard/calls-dashboard/services/file-stats.service";
import { MinutesStatsService } from "./neosound/pages/dashboard/calls-dashboard/services/minutes-stats.service";
import { TagCloudService } from "./neosound/pages/dashboard/calls-dashboard/services/tag-cloud.service";
import { TopicCloudService } from "./neosound/pages/dashboard/calls-dashboard/services/topic-cloud.service";
import { ChecklistStatsService } from "./neosound/pages/dashboard/assessment-dashboard/services/checklist-stats.service";

import { SignupLinkComponent } from "./neosound/pages/auth/signup-link/signup-link.component";
import { SignupDetailedComponent } from "./neosound/pages/auth/signup-detailed/signup-detailed.component";
import { TermsComponent } from "./neosound/pages/auth/terms/terms.component";
import { ForgotPasswordComponent } from "./neosound/pages/auth/forgot-password/forgot-password.component";

import { AccountDetailsComponent } from "./neosound/pages/user/account-details/account-details.component";
import { FilesListComponent } from "./neosound/pages/user/files-list/files-list.component";
import { TextFilesListComponent } from "./neosound/pages/user/text-files-list/text-files-list.component";
import { FileResultsComponent } from "./neosound/pages/user/file-results/file-results.component";
import { LandingComponent } from "./neosound/pages/landing/landing.component";
import { OrganizationSettingsComponent } from "./neosound/pages/admin/organisation-settings/organization-settings.component";
import { KeywordsComponent } from "./neosound/pages/admin/organisation-settings/components/keywords/keywords.component";
import { SensitiveDataComponent } from "./neosound/pages/admin/organisation-settings/components/sensitive-data/sensitive-data.component";
import { CheckListComponent } from "./neosound/pages/admin/organisation-settings/components/check-list/check-list.component";

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
import { TagCloudModule } from "angular-tag-cloud-module";
import { NbAlertModule, NbInputModule } from "@nebular/theme";
import { ToastrModule } from "ngx-toastr";
import { NgDatepickerModule } from "ng2-datepicker";
import { TagInputModule } from "ngx-chips";

import {
  FooterComponent,
  HeaderComponent,
} from "./@theme/components";

import {
  OneColumnLayoutComponent,
} from "./@theme/layouts";

import { UploadDialogComponent } from "./neosound/pages/user/upload-dialog/upload-dialog.component";
import { UploadProgressComponent } from "./neosound/pages/user/upload-progress/upload-progress.component";

import { FileDropModule } from "ngx-file-drop";

import { PlayerComponent } from "./neosound/pages/guest/player-details/player/player.component";
import { PlayerDetailsComponent } from "./neosound/pages/guest/player-details/player-details.component";
import { AnalyticDetailsComponent } from "./neosound/pages/guest/analytic-details/analytic-details.component";

import { TextLogComponent } from "./neosound/pages/guest/player-details/cards/text-log/text-log.component";
import { CheckListFormComponent } from "./neosound/pages/guest/player-details/cards/check-list/check-list.component";
import { TextComplianceComponent } from "./neosound/pages/guest/player-details/cards/text-compliance/text-compliance.component";
import { FullTextComponent } from "./neosound/pages/guest/player-details/cards/full-text/full-text.component";
import { TextStopwordsComponent } from "./neosound/pages/guest/player-details/cards/text-stopwords/text-stopwords.component";
import { TextSankeyComponent } from "./neosound/pages/guest/player-details/cards/text-sankey/text-sankey.component";
import { TextKeywordsComponent } from "./neosound/pages/guest/player-details/cards/text-keywords/text-keywords.component";
import { TextTagCloudComponent } from "./neosound/pages/guest/player-details/cards/text-tag-cloud/text-tag-cloud.component";
import { TextHitsWordsComponent } from "./neosound/pages/guest/player-details/cards/text-hits-words/text-hits-words.component";
import { FileInfoComponent } from "./neosound/pages/guest/player-details/cards/file-info/file-info.component";

import { FileChartDataService } from "./neosound/pages/guest/player-details/services/file-chart-data.service";
import { FileResultService } from "./neosound/pages/guest/player-details/services/file-result.service";
import { FileInfoService } from "./neosound/pages/guest/player-details/services/file-info.service";
import { WaveSurferService } from "./neosound/pages/guest/player-details/player/wave-surfer.service";
import { FileStatsService } from "./neosound/pages/guest/player-details/services/file-stats.service";
import { FilePeeksService } from "./neosound/pages/guest/player-details/services/file-peeks.service";

import { ApiPageComponent } from "./neosound/pages/user/api-page/api-page.component";
import { NgxEchartsModule } from "ngx-echarts";
import { PageNotFoundComponent } from "./neosound/pages/page-not-found/page-not-found.component";
import { LanguageService } from "./neosound/services/language.service";
import { NgxPaginationModule } from "ngx-pagination";
import { IntervalDirective } from "./neosound/directives/interval.detective";
import { ContenteditableDirective } from "./neosound/directives/contenteditable.directive";
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
import { AssessmentDashboardComponent } from './neosound/pages/dashboard/assessment-dashboard/assessment-dashboard.component';
import { AssessmentNcallsByQuestionComponent } from './neosound/pages/dashboard/assessment-dashboard/cards/assessment-ncalls-by-question/assessment-ncalls-by-question.component';
import { AssessmentNcallsAndNpositiveByQuestionComponent } from './neosound/pages/dashboard/assessment-dashboard/cards/assessment-ncalls-and-npositive-by-question/assessment-ncalls-and-npositive-by-question.component';
import { AssessmentAvgscoreByAgentComponent } from './neosound/pages/dashboard/assessment-dashboard/cards/assessment-avgscore-by-agent/assessment-avgscore-by-agent.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    OneColumnLayoutComponent,
    AppComponent,
    MinutesSecondsPipe,
    MainComponent,
    LoginComponent,
    DashboardComponent,
    StopwordsComponent,
    HitsStopwordsComponent,
    PopularWordsComponent,
    FreqWordsComponent,
    TopicComponent,
    HitsTopicsComponent,
    AssessmentByAgentComponent,
    MinutesStatsBatchesComponent,
    MinutesStatsMinutesComponent,
    SentimentStatsBatchesComponent,
    SentimentalCallsByDayComponent,
    SentimentStatsDayComponent,
    SentimentalOfCallsComponent,
    CallsByDayComponent,
    UploadDialogComponent,
    SignupLinkComponent,
    SignupDetailedComponent,
    UploadProgressComponent,
    TermsComponent,
    ForgotPasswordComponent,
    PlayerComponent,
    TagifyComponent,
    AccountDetailsComponent,
    FilesListComponent,
    TextFilesListComponent,
    FileResultsComponent,
    LandingComponent,
    OrganizationSettingsComponent,
    KeywordsComponent,
    SensitiveDataComponent,
    CheckListComponent,
    AboutComponent,
    PlayerDetailsComponent,
    AnalyticDetailsComponent,
    TextLogComponent,
    CheckListFormComponent,
    TextComplianceComponent,
    TextStopwordsComponent,
    AverageSentimentsComponent,
    CountSentimentsComponent,
    SentimentalSankeyComponent,
    SentimentalTreeComponent,
    KeywordsPhrasesComponent,
    UploadInstructionsComponent,
    QueriesChartComponent,
    TextSankeyComponent,
    TextKeywordsComponent,
    TextTagCloudComponent,
    TextHitsWordsComponent,
    FullTextComponent,
    ApiPageComponent,
    PageNotFoundComponent,
    IntervalDirective,
    ContenteditableDirective,
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
    StopWordsComponent,
    InfoBarComponent,
    CardSpinnerComponent,
    NumberOfCallsComponent,
    PerformanceByAgentComponent,
    ProcessedCallsComponent,
    TextsDashboardComponent,
    FileInfoComponent,
    TagifyComponent,
    MinutesSecondsPipe,
    AssessmentDashboardComponent,
    AssessmentNcallsByQuestionComponent,
    AssessmentNcallsAndNpositiveByQuestionComponent,
    AssessmentAvgscoreByAgentComponent
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
    DragulaModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    ButtonsModule.forRoot(),

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),

    FileDropModule,
    ToastrModule.forRoot(),
    NgDatepickerModule,
    NgxPaginationModule,
    TagInputModule,
    BsDatepickerModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    CanDeactivateGuard,
    UsersService,
    FilesService,
    FilterService,
    FileChartDataService,
    FileInfoService,
    FileStatsService,
    ApiCallsStatsService,
    ChartDataService,
    DashboardFileStatsService,
    MinutesStatsService,
    TagCloudService,
    TopicCloudService,
    ChecklistStatsService,
    FilePeeksService,
    FileResultService,
    UploadService,
    TextFilterService,
    OrganizationSettingsService,
    PlayerService,
    AnalyticsService,
    MediaRecorderService,
    WaveSurferService,
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
