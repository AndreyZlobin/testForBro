import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../shared';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string;
  password: string;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
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
