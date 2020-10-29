import { AppStoreService } from "./neosound/shared/app.store";
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  appConfig: any;

  constructor(private _appStore: AppStoreService) {}

  ngOnInit(): void {
    this.appConfig = this._appStore.config;

    if (this.appConfig.title) {
      document.title = this.appConfig.title;
    }
    const colorMap = {
      primary: "--color-primary",
      secondary: "--color-secondary",
    };
    Object.keys(colorMap).forEach((key) => {
      document.documentElement.style.setProperty(
        colorMap[key],
        this.appConfig.colors[key]
      );
    });
  }
}
