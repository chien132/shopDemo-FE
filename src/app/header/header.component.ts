import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "../services/auth/storage.service";
import { LoginService } from "../services/auth/login.service";
import { JwtService } from "../services/jwt.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  username = this.jwtService.getUsername();
  constructor(
    private loginService: LoginService,
    private router: Router,
    private storageService: StorageService,
    private jwtService: JwtService
  ) {}
  ngOnInit() {
    this.storageService.watchStorage().subscribe((data) => {
      // if (data == "added" || data == "removed") {
      this.username = this.jwtService.getUsername();
      console.log(this.username);
      // }
    });
  }

  logOut() {
    this.loginService.logOut();
    if (this.router.url === "/cart" || this.router.url.includes("/orders")) {
      this.router.navigate(["/login"]);
    }
  }
}
