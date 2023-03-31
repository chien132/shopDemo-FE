import { HttpErrorResponse } from "@angular/common/http";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "../services/auth/login.service";
import { JwtService } from "../services/jwt.service";
import { UtilService } from "../services/util.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  @ViewChild("usernameInput", { static: true }) usernameRef: ElementRef;
  @ViewChild("passwordInput", { static: true }) passwordRef: ElementRef;

  // authAccount: AuthModel;

  customer: { username: string; password: string };
  constructor(
    private loginService: LoginService,
    private router: Router,
    private jwtService: JwtService
  ) {}
  onLogin() {
    this.customer = {
      username: this.usernameRef.nativeElement.value,
      password: this.passwordRef.nativeElement.value,
    };
    if (
      this.customer.username.length == 0 ||
      this.customer.password.length == 0
    ) {
      UtilService.sendMessage("Please input all information!", false);
      return;
    }
    this.loginService.logIn(this.customer).subscribe(
      (response) => {
        this.loginService.setToken(response.token);
        UtilService.sendMessage("You are now logged in", true);
        if (this.jwtService.getRole() === "ROLE_OWNER") {
          this.router.navigate(["/adminpanel"]);
        } else {
          this.router.navigate(["/items"]);
        }
        console.log(this.jwtService.getDecodeToken());
      },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
          case 401:
            UtilService.sendMessage(
              "Username or password is incorrect!",
              false
            );
            break;
          default:
            // UtilService.sendMessage(error.error.message, false);
            UtilService.sendMessage("Cannot connect to the server!", false);
            console.log(error);
        }
      }
    );
  }
}
