import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Customer } from "src/app/models/customer.model";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  baseUrl = "http://localhost:8080/api/";

  constructor(private httpClient: HttpClient) {}

  logIn(customer): Observable<AuthModel> {
    return this.httpClient.post<AuthModel>(`${this.baseUrl}login`, customer);
  }

  setToken(token: string, username: string, type: string) {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("usename", username);
    localStorage.setItem("type", type);
  }

  logOut() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("usename");
    localStorage.removeItem("type");
  }
}

export interface AuthModel {
  id: number;
  username: string;
  roles: string[];
  tokenType: string;
  accessToken: string;
}
