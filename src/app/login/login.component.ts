import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('usernameInput', { static: true }) usernameRef: ElementRef;
  @ViewChild('passwordInput', { static: true }) passwordRef: ElementRef;

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
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
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
      console.log('LOGIN');
    } else {
      this.form.controls.confirmPassword.clearValidators();
      this.form.controls.confirmPassword.updateValueAndValidity();
      console.log('SIGNUP');
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
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

  ngOnDestroy() {
    if (this.subRouterEvent) this.subRouterEvent.unsubscribe();
  }

  // valid() {
  //   let username = this.usernameRef.nativeElement.value;
  //   let password = this.passwordRef.nativeElement.value;
  //   if (username.length == 0 || password.length == 0) {
  //     UtilService.sendMessage('Please input all information!', false);
  //     return false;
  //   }
  //   if (
  //     username.includes('"') ||
  //     username.includes("'") ||
  //     password.includes('"') ||
  //     password.includes("'")
  //   ) {
  //     UtilService.sendMessage(`"  and  '  are not allow here!!!`, false);
  //     return false;
  //   }
  //   return true;
  // }

  onLogin() {
    let customer = {
      username: this.usernameRef.nativeElement.value,
      password: this.passwordRef.nativeElement.value,
    };
    this.loginService.logIn(customer);
  }
  onSignup() {
    let customer = {
      username: this.usernameRef.nativeElement.value,
      password: this.passwordRef.nativeElement.value,
      role: true,
    };
    this.loginService.signUp(customer);
  }
}
