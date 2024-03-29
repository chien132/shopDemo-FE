import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StorageService } from './storage.service';
import { catchError } from 'rxjs/operators';
import { UtilService } from '../util.service';
import { Router } from '@angular/router';
import { JwtService } from './jwt.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = environment.backendURL;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  checkUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + 'check/' + username).pipe(
      catchError((error) => {
        return UtilService.errorHandler(error);
      })
    );
  }

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
