import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "../services/auth/storage.service";
import { LoginService } from "../services/auth/login.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  username = this.storageService.getItem("username");
  constructor(
    private loginService: LoginService,
    private router: Router,
    private storageService: StorageService
  ) {}
  ngOnInit() {
    this.storageService.watchStorage().subscribe((data) => {
      if (data == "added" || data == "removed") {
        this.username = this.storageService.getItem("username");
      }
    });
  }

  logOut() {
    this.loginService.logOut();
    if (this.router.url === "/cart") {
      this.router.navigate(["/items"]);
    }
  }
}
