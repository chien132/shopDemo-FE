import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HttpService } from "../services/http.service";
import { Customer } from "../models/customer.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @ViewChild("usernameInput", { static: true }) usernameRef: ElementRef;
  @ViewChild("passwordInput", { static: true }) passwordRef: ElementRef;
  customer: { username: string; password: string };
  constructor(private httpService: HttpService) {}
  submitted = false;

  ngOnInit() {}

  onLogin() {
    this.customer = {
      username: this.usernameRef.nativeElement.value,
      password: this.passwordRef.nativeElement.value,
    };
    this.httpService.logIn(this.customer);
  }
}
