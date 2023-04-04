import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';
import { JwtService } from '../services/auth/jwt.service';
import { UtilService } from '../services/util.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  @ViewChild('usernameInput', { static: true }) usernameRef: ElementRef;
  @ViewChild('passwordInput', { static: true }) passwordRef: ElementRef;
  @ViewChild('passwordConfirmInput', { static: true })
  passwordConfirmRef: ElementRef;
  subRouterEvent: Subscription;
  currentRoute: string;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private jwtService: JwtService
  ) {
    this.subRouterEvent = router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url.slice(1, event.url.length);
      });
  }

  ngOnDestroy() {
    if (this.subRouterEvent) this.subRouterEvent.unsubscribe();
  }
  valid() {
    let username = this.usernameRef.nativeElement.value;
    let password = this.passwordRef.nativeElement.value;
    if (username.length == 0 || password.length == 0) {
      UtilService.sendMessage('Please input all information!', false);
      return false;
    }
    if (
      username.includes('"') ||
      username.includes("'") ||
      password.includes('"') ||
      password.includes("'")
    ) {
      UtilService.sendMessage(`"  and  '  are not allow here!!!`, false);
      return false;
    }
    return true;
  }
  onKeyUp(event) {
    if (event.keyCode === 13) {
      if (event.target.id === 'username' && event.target.value.length > 0) {
        document.getElementById('password').focus();
      } else if (
        event.target.id === 'password' &&
        event.target.value.length > 0
      ) {
        if (this.currentRoute === 'login') {
          document.getElementById('loginbtn').click();
        } else {
          document.getElementById('passwordConfirm').focus();
        }
      } else if (
        event.target.id === 'passwordConfirm' &&
        event.target.value.length > 0
      ) {
        document.getElementById('loginbtn').click();
      }
    }
  }

  onLogin() {
    if (!this.valid()) {
      return;
    }
    let customer = {
      username: this.usernameRef.nativeElement.value,
      password: this.passwordRef.nativeElement.value,
    };
    this.loginService.logIn(customer).subscribe(
      (response) => {
        this.loginService.setToken(response.token);
        UtilService.sendMessage('You are now logged in', true);
        if (this.jwtService.getRole() === 'ROLE_OWNER') {
          this.router.navigate(['/adminpanel/item']);
        } else {
          this.router.navigate(['/items']);
        }
        console.log(this.jwtService.getDecodeToken());
      },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
          case 401:
            UtilService.sendMessage(
              'Username or password is incorrect!',
              false
            );
            break;
          default:
            UtilService.sendMessage('Cannot connect to the server!', false);
            console.log(error);
        }
      }
    );
  }
  onSignup() {
    if (!this.valid()) {
      return;
    }
    let customer = {
      username: this.usernameRef.nativeElement.value,
      password: this.passwordRef.nativeElement.value,
      role: true,
    };
    let passwordConfirm = this.passwordConfirmRef.nativeElement.value;

    if (passwordConfirm.length == 0) {
      UtilService.sendMessage('Please confirm your password!', false);
      return;
    } else if (passwordConfirm !== customer.password) {
      UtilService.sendMessage('Password confirm does not match!', false);
      return;
    }

    this.loginService.signUp(customer).subscribe(
      (response) => {
        UtilService.sendMessage(response.message, true);
        this.router.navigate(['/login']);
      },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            UtilService.sendMessage(error.error.message, false);
            break;
          default:
            UtilService.sendMessage('Cannot connect to the server!', false);
            console.log(error);
        }
      }
    );
  }
}
