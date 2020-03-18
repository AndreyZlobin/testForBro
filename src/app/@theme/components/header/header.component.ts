import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../neosound/services/analytics.service';
import { LayoutService } from '../../../@core/data/layout.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../neosound/services/users.service';
import { LanguageService } from '../../../neosound/services/language.service';
import { DataService } from '../../../neosound/shared';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  config = {};
  isLoaded = false;
  showUploadDialog = false;

  @Input() position = 'normal';

  user: any;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private layoutService: LayoutService,
              private router: Router,
              private dataService: DataService,
              private http: HttpClient,
            ) {
  }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);
    this.http.get('assets/config/config.json').subscribe((data: any) => {
      this.config = this.dataService.config = data;
      this.isLoaded = true;
    });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
  }

  navigate(url) {
    this.router.navigateByUrl(url);
    return false;
  }

  logout() {
    this.analyticsService.trackEvent('user', 'logout');
    localStorage.removeItem('user');
    localStorage.removeItem('apikey');
    this.navigate('/auth/login');
    return false;
  }

  isLoggedIn() {
    return !!localStorage.getItem('user');
    // return this.userServ.isAuthenticated();
  }

  username() {
    const data = localStorage.getItem('user');
    const user = data && JSON.parse(data);
    return data && user && user.username;
  }

  company() {
    const data = localStorage.getItem('user');
    const user = data && JSON.parse(data);
    return data && user && user.companyname;
  }

  getLanguage(ln) {
    const lang = localStorage.getItem('lang');
    return lang && (lang === ln) || !lang && ln === 'en';
  }

  setLanguage(val = 'en') {
    this.analyticsService.trackEvent('user', 'setLanguage', val);
    localStorage.setItem('lang', val);
  }

  getCurrentLanguageName() {
    const lang = localStorage.getItem('lang');
    const current = lang || 'en';
    switch (current) {
      case 'en':
        return 'English';
      case 'sp':
        return 'Español';
      case 'ru':
        return 'Русский';
      case 'pt':
        return 'Português';
      default:
        return 'English';
    }
  }
  showUpload() {
    this.analyticsService.trackEvent('user', 'upload');
    this.showUploadDialog = !this.showUploadDialog;
  }

  t(v) {
    return LanguageService.t(v);
  }

}
