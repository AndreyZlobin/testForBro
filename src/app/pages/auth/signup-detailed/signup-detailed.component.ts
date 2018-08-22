import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-detailed',
  templateUrl: './signup-detailed.component.html',
  styleUrls: ['./signup-detailed.component.scss']
})
export class SignupDetailedComponent implements OnInit {
  form: FormGroup;
  error = '';

  constructor(
    private userService: UsersService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  submit() {
    this.error = '';
    // if (this.form.value.password !== this.form.value.passwordConfirm) {
    //   this.error = 'Passwords not match';
    // }
    const params = {
      'username': this.form.value.username,
      'firstname': this.form.value.firstname,
      'lastname': this.form.value.lastname,
      'email': this.form.value.email
    };
    this.userService
      .createUser(params)
      .subscribe(() => this.router.navigateByUrl('/'));

  }

  private createForm() {
    this.form = new FormGroup({
      username: new FormControl({ value: ''}, Validators.required),
      firstname: new FormControl({ value: ''}, Validators.required),
      lastname: new FormControl({ value: ''}, Validators.required),
      email: new FormControl({ value: ''}, Validators.required),
      // password: new FormControl({ value: ''}, Validators.required),
      // passwordConfirm: new FormControl({ value: ''}, Validators.required),
      agree: new FormControl({ value: ''}, Validators.required),
    });
    this.patchForm();
  }

  patchForm() {
    if (this.form) {
      this.form.setValue({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        // password: '',
        // passwordConfirm: '',
        agree: '',
      });
    }
  }

}
