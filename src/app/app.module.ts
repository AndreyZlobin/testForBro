import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AuthenticationModule } from './shared';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { DataService } from './shared';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthenticationModule,
    AppRoutingModule,
    CommonModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
  ],
  providers: [
    DataService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
