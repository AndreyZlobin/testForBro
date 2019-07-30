/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './neosound/services/analytics.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from './neosound/shared';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private analytics: AnalyticsService,
    private http: HttpClient,
    private dataService: DataService) {
      this.http.get('assets/config/config.json').subscribe((data: any) => {
        this.dataService.config = data;
        if (data.title) {
          document.title = data.title;
        }
        const colorMap = {
          'primary': '--color-primary',
          'secondary': '--color-secondary',
        };
        Object.keys(colorMap).forEach(key => {
          document.documentElement.style.setProperty(colorMap[key], data.colors[key]);
        });
      });
  }

  ngOnInit(): void {

  }
}
