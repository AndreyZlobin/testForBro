import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UsersService } from '../../../services/users.service';
import { FormGroup } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string;
  password: string;
  form = new FormGroup({});
  showMessages;
  message;
  messageSuccess;

  constructor(
    private router: Router,
    private userService: UsersService,
  ) {
    this.messageSuccess = this.userService.getMessage();
  }

  public login() {
    const params = {
      'username': this.username,
      'password': this.password
    };
    this.userService
      .loginUser(params)
      .subscribe(
        () => this.router.navigateByUrl('/user/files'),
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
