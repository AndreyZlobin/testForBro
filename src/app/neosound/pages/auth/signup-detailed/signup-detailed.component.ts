import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import { forbiddenNameValidator } from '../../../directives/forbidden-password.directive';

@Component({
  selector: 'app-signup-detailed',
  templateUrl: './signup-detailed.component.html',
  styleUrls: ['./signup-detailed.component.scss']
})
export class SignupDetailedComponent implements OnInit {
  form: FormGroup;
  error = '';
  message;

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
      'email': this.form.value.email,
      'password': this.form.value.password,
      'apikey': this.form.value.apikey,
    };
    this.userService
      .registerUser(params)
      .subscribe(
        () => {
          this.userService.addMessage('Signed up successfully');
          this.router.navigateByUrl('/')
        },
        (e) => this.error = e.error.message,
      );

  }

  private createForm() {
    this.form = new FormGroup({
      username: new FormControl({ value: ''}, Validators.required),
      firstname: new FormControl({ value: ''}, Validators.required),
      lastname: new FormControl({ value: ''}, Validators.required),
      email: new FormControl({ value: ''}, Validators.required),
      apikey: new FormControl({ value: ''}),
      password: new FormControl({ value: ''}, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.,]+$/),
        // forbiddenNameValidator(/bob/i)
      ]),
      // passwordConfirm: new FormControl({ value: ''}, Validators.required),
      agree: new FormControl({ value: false}),
      agreeTerms: new FormControl({ value: false}),
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
        password: '',
        apikey: '',
        // passwordConfirm: '',
        agree: false,
        agreeTerms: false,
      });
    }
  }

}
