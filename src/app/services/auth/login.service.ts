import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  baseUrl = "http://localhost:8080/api/";

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  logIn(customer): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}login`, customer);
  }

  signUp(customer): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}signup`,
      customer
    );
  }

  setToken(token: string) {
    this.storageService.setItem("jwtToken", token);
  }

  logOut() {
    this.storageService.removeItem("jwtToken");
  }
}
