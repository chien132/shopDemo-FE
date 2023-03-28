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
    private httpClient: HttpClient,
    private storageService: StorageService
  ) {}

  logIn(customer): Observable<AuthModel> {
    return this.httpClient.post<AuthModel>(`${this.baseUrl}login`, customer);
  }

  setToken(id: number, token: string, username: string, type: string) {
    this.storageService.setItem("customerId", String(id));
    this.storageService.setItem("username", username);
    this.storageService.setItem("type", type);
    this.storageService.setItem("jwtToken", token);
  }

  logOut() {
    this.storageService.removeItem("customerId");
    this.storageService.removeItem("username");
    this.storageService.removeItem("type");
    this.storageService.removeItem("jwtToken");
  }
}

export interface AuthModel {
  id: number;
  username: string;
  roles: string[];
  tokenType: string;
  accessToken: string;
}
