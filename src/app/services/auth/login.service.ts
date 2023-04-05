import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StorageService } from './storage.service';
import { catchError } from 'rxjs/operators';
import { UtilService } from '../util.service';
import { Router } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = 'http://localhost:8080/api/';

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  logIn(customer) {
    this.http
      .post<{ token: string }>(`${this.baseUrl}login`, customer)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return UtilService.errorHandler(error);
        })
      )
      .subscribe((response) => {
        this.setToken(response.token);
        UtilService.sendMessage(
          UtilService.translation.instant('LoggedIn'),
          true
        );
        if (this.jwtService.getRole() === 'ROLE_OWNER') {
          this.router.navigate(['/adminpanel/item']);
        } else {
          this.router.navigate(['/items']);
        }
      });
  }

  signUp(customer) {
    this.http
      .post<{ message: string }>(`${this.baseUrl}signup`, customer)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return UtilService.errorHandler(error);
        })
      )
      .subscribe((response) => {
        UtilService.sendMessage(
          UtilService.translation.instant('Registered'),
          true
        );
        this.router.navigate(['/login']);
      });
  }

  setToken(token: string) {
    this.storageService.setItem('jwtToken', token);
  }

  logOut() {
    this.storageService.removeItem('jwtToken');
  }
}
