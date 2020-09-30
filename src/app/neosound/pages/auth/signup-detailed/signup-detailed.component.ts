import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import { forbiddenNameValidator } from '../../../directives/forbidden-password.directive';
import { LanguageService } from '../../../services/language.service';
import { DataService } from '../../../shared';
import { HttpClient } from '@angular/common/http';
import { schemeConfig } from '../login/login.component';

@Component({
  selector: 'app-signup-detailed',
  templateUrl: './signup-detailed.component.html',
  styleUrls: ['./signup-detailed.component.scss']
})
export class SignupDetailedComponent implements OnInit, OnDestroy {
  form: FormGroup;
  error = '';
  message;
  enabledSubmit = true;
  config = schemeConfig;

  constructor(
    private userService: UsersService,
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.createForm();

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
    const el = document.getElementsByTagName('nb-card-header');
    const logo = document.getElementById('loginLogo');
    if (el && el[0] && logo) {
      el[0].removeChild(logo);
    }
  }

  submit() {
    this.error = '';
    // if (this.form.value.password !== this.form.value.passwordConfirm) {
    //   this.error = 'Passwords not match';
    // }
    this.enabledSubmit = false;
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
          this.userService.addMessage(LanguageService.t('Signed up successfully'));
          this.router.navigateByUrl('/');
          this.enabledSubmit = true;
        },
        (e) => {
          this.error = LanguageService.t(e.error.message);
          this.enabledSubmit = true;
        }
      );

  }

  private createForm() {
    this.form = new FormGroup({
      username: new FormControl({ value: ''}, Validators.required),
      firstname: new FormControl({ value: ''}, Validators.required),
      lastname: new FormControl({ value: ''}, Validators.required),
      email: new FormControl({ value: ''}, Validators.required),
      apikey: new FormControl({ value: ''}, Validators.required),
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

  get legalNameFull() {
    return this.dataService.config && (this.dataService.config as any).legalNameFull || 'NeoSound Intelligence B.V.';
  }

  t(v) {
    return LanguageService.t(v);
  }

}
