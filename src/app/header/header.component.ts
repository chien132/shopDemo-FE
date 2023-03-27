import { Component, EventEmitter, Output } from "@angular/core";
import { LoginService } from "../services/auth/login.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  constructor(private loginService: LoginService) {}
  logOut() {
    this.loginService.logOut();
  }
}
