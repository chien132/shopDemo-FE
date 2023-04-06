import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { UtilService } from '../services/util.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  subRouterEvent: Subscription;
  currentRoute: string;

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
  submitted = false;

  constructor(
    private loginService: LoginService,
    router: Router,
    private formBuilder: FormBuilder
  ) {
    this.subRouterEvent = router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url.slice(1, event.url.length);
      });
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          UtilService.checkSpecialChar,
        ],
        this.checkUsernameAvail.bind(this),
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
          UtilService.checkSpecialChar,
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, UtilService.matchValues('password')],
      ],
    });

    this.form.controls.password.valueChanges.subscribe(() => {
      this.form.controls.confirmPassword.updateValueAndValidity();
    });

    if (this.currentRoute === 'signup') {
      this.form.controls.confirmPassword.setValidators([
        Validators.required,
        UtilService.matchValues('password'),
      ]);
      this.form.controls.username.setAsyncValidators(
        this.checkUsernameAvail.bind(this)
      );
    } else {
      this.form.controls.confirmPassword.clearValidators();
      this.form.controls.confirmPassword.updateValueAndValidity();
      this.form.controls.username.clearAsyncValidators();
    }
  }

  ngOnDestroy() {
    if (this.subRouterEvent) this.subRouterEvent.unsubscribe();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  checkUsernameAvail(control: FormControl): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.loginService.checkUsername(control.value).subscribe((res) => {
        if (res === true) {
          resolve({ usernameNotAvailable: true });
        } else resolve(null);
      });
    });
    return promise;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.currentRoute === 'login' ? this.onLogin() : this.onSignup();
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  onLogin() {
    let customer = {
      username: this.form.value['username'],
      password: this.form.value['password'],
    };
    this.loginService.logIn(customer);
  }
  onSignup() {
    let customer = {
      username: this.form.value['username'],
      password: this.form.value['password'],
      role: true,
    };
    this.loginService.signUp(customer);
  }
}
