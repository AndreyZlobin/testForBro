import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UsersService } from '../../../services/users.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { FormGroup } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../../shared';

export const schemeConfig = {
  "title": "NeoSound - Turn emotions into data!",
  "metaDescription": "NeoSound - Turn emotions into data!",
  "logofilename": "logo.jpg",
  "legalName": "NeoSound",
  "legalNameFull": "NeoSound Intelligence B.V.",
  "companyMainUrl": "https://NeoSound.eu",
  "footer": {
      "title": {
          "show": true,
          "text": "Created with ♥ by",
          "link": "http://neosound.eu",
          "name": "NeoSound"
      },
      "terms": {
          "show": true,
          "text": "Terms of Use",
          "link": "/terms"
      },
      "about": {
          "show": true,
          "text": "About",
          "link": "https://neosound.eu/"
      }
  },
  "header": {
    "api": {
        "show": true,
        "text": "API",
        "link": "/user/api"
    },
    "about": {
        "show": true,
        "text": "About",
        "link": "https://neosound.eu/"
    },
    "language": {
        "show": true
    },
    "colors": {
        "primary": "rgb(0, 154, 210)",
        "secondary": "rgb(0, 154, 210)"
    }
  }
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  username: string;
  password: string;
  form = new FormGroup({});
  showMessages;
  message;
  messageSuccess;
  config = schemeConfig;

  constructor(
    private router: Router,
    private userService: UsersService,
    private http: HttpClient,
    private dataService: DataService,
    private analyticsService: AnalyticsService,
  ) {
    this.messageSuccess = this.userService.getMessage();
  }

  ngOnInit() {
    const el = document.getElementsByTagName('nb-card-header');

    this.http.get('assets/config/config.json').subscribe((data: any) => {
      this.config = this.dataService.config = data;
      if (el && el[0] && this.config.logofilename && !document.getElementById('loginLogo')) {
        const logo = document.createElement('IMG');
        logo.setAttribute('src', `assets/config/${this.config.logofilename}`);
        logo.setAttribute('class', 'loginLogo');
        logo.setAttribute('id', 'loginLogo');
        el[0].appendChild(logo);
      }
    });
  }

  ngOnDestroy() {
  }

  public login() {
    this.analyticsService.trackEvent('user', 'login');
    const params = {
      'username': this.username,
      'password': this.password,
    };
    this.userService
      .loginUser(params)
      .subscribe(
        () => this.router.navigateByUrl('/'),
        (e) => {
          if (e.error.message) {
            this.message = LanguageService.t(e.error.message);
          } else {
            this.message = LanguageService.t('Wrong credentials');
          }
        });
  }

  t(v) {
    return LanguageService.t(v);
  }

}
