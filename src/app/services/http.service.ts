import { Injectable, OnInit } from "@angular/core";
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { map, filter, switchMap } from "rxjs/operators";
import { Item } from "../models/item.model";

@Injectable({
  providedIn: "root",
})
export class HttpService implements OnInit {
  baseUrl = "http://localhost:8080/api/";
  authAccount: AuthModel;
  headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {}
  ngOnInit() {
    this.headers = new HttpHeaders();
    // this.headers.set("Access-Control-Allow-Origin", "*");
    // headers.append("Content-Type", "application/json");
    // headers.append("Authorization", "Bearer " + this.jwtToken);
  }

  getListItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(`${this.baseUrl}items`);
  }

  getCustomerContent() {
    console.log(this.headers.get("Authorization"));

    return this.httpClient.get(`${this.baseUrl}test/customer`, {
      headers: this.headers,
    });
  }

  logIn(customer) {
    return this.httpClient
      .post<AuthModel>(`${this.baseUrl}login`, customer)
      .subscribe(
        (response) => {
          this.authAccount = response;
          this.headers = new HttpHeaders();
          this.headers.append(
            "Authorization",
            "Bearer " + this.authAccount.accessToken
          );
          console.log(this.authAccount);
          console.log(this.headers.get("Authorization"));
        },
        (error: HttpErrorResponse) => {
          console.log(error.error.message);
        }
      );
  }
}

export interface AuthModel {
  id: number;
  username: string;
  roles: string[];
  tokenType: string;
  accessToken: string;
}
