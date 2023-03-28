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

  logIn(customer): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>(
      `${this.baseUrl}login`,
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
