import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email: string;
  form = new FormGroup({});
  message;

  constructor(
    private userService: UsersService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  submit() {
    const params = {
      'email': this.email,
    };
    this.userService
      .forgotPassword(params)
      .subscribe(
        () => this.router.navigateByUrl('/'),
        (e) => this.message = e.error.message,
      );
  }

}
