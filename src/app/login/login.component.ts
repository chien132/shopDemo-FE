import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthModel, LoginService } from "../services/auth/login.service";
declare var jQuery: any;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @ViewChild("usernameInput", { static: true }) usernameRef: ElementRef;
  @ViewChild("passwordInput", { static: true }) passwordRef: ElementRef;
  @ViewChild("liveToast", { static: true }) successToast: ElementRef;
  @ViewChild("invalidFeedback", { static: true }) invalidFeedback: ElementRef;

  authAccount: AuthModel;

  customer: { username: string; password: string };
  constructor(
    private loginService: LoginService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {}

  onLogin() {
    this.customer = {
      username: this.usernameRef.nativeElement.value,
      password: this.passwordRef.nativeElement.value,
    };
    this.loginService.logIn(this.customer).subscribe(
      (response) => {
        this.loginService.setToken(
          response.id,
          response.accessToken,
          response.username,
          response.roles[0] === "ROLE_OWNER" ? "OWNER" : "CUSTOMER"
        );

        // console.log(response);

        jQuery(this.successToast.nativeElement).toast("show");
        setTimeout(() => {
          // jQuery(this.successToast.nativeElement).toast("hide");
          this.router.navigate(["/items"]);
        }, 1000);
      },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
          case 401:
            this.renderer.setProperty(
              this.invalidFeedback.nativeElement,
              "innerHTML",
              "Username or password is incorrect!"
            );
          default:
            console.log(error);
        }
      }
    );
  }
}
