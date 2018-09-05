import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UsersService } from '../../../services/users.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string;
  password: string;
  form = new FormGroup({});
  showMessages;

  constructor(
    private router: Router,
    private userService: UsersService,
  ) { }

  public login() {
    const params = {
      'username': this.username,
      'password': this.password
    };
    this.userService
      .loginUser(params)
      .subscribe(() => this.router.navigateByUrl('/'));
  }

}
