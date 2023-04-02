import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { StorageService } from "../services/auth/storage.service";
import { LoginService } from "../services/auth/login.service";
import { JwtService } from "../services/jwt.service";
import { filter } from "rxjs/operators";
import { ItemService } from "../services/item.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  username = this.jwtService.getUsername();
  role = this.jwtService.getRole();
  currentRoute: string;
  searchTimer;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private storageService: StorageService,
    private jwtService: JwtService,
    private itemService: ItemService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  onInput(event) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const searchStr =
        "%" + event.replace(/[^\w\s]/gi, "_").replace(/ /g, "%") + "%";
      this.itemService.itemFilter.emit(searchStr);
    }, 300);
  }

  ngOnInit() {
    this.storageService.watchStorage().subscribe((data) => {
      // if (data == "added" || data == "removed") {
      this.username = this.jwtService.getUsername();
      this.role = this.jwtService.getRole();
      // }
    });
  }

  logOut() {
    this.loginService.logOut();
    if (
      this.router.url.includes("/cart") ||
      this.router.url.includes("/orders") ||
      this.router.url.includes("/adminpanel")
    ) {
      this.router.navigate(["/login"]);
    }
  }
}
