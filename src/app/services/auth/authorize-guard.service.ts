import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "./login.service";
import { JwtService } from "../jwt.service";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthorizeGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private storageService: StorageService,
    private jwtService: JwtService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.jwtService.getId()) {
      if (this.jwtService.isTokenExpired()) {
        // Should Redirect Sig-In Page
        this.router.navigate(["/login"]);
      } else {
        return true;
      }
    } else {
      return new Promise((resolve) => {
        //   this.loginService
        //     .signIncallBack()
        //     .then((e) => {
        //       resolve(true);
        //     })
        //     .catch((e) => {
        //       // Should Redirect Sign-In Page
        //     });
      });
    }
  }
}
