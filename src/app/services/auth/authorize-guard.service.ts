import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthorizeGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (true) {
      // check for user existance
      if (true) {
        //check expire time, if expired
        // Should Redirect Sig-In Page
        return true;
      } else {
        return true;
      }
    } else {
      this.router.navigate(["/login"]);
    }
  }
}
