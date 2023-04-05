import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';
import { UtilService } from '../util.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivate {
  constructor(private jwtService: JwtService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const role = this.jwtService.getRole();
    if (!role) {
      UtilService.sendMessage(
        UtilService.translation.instant('AuthRequired'),
        false
      );
      this.router.navigate(['/login']);
      return false;
    } else {
      if (this.jwtService.isTokenExpired()) {
        this.router.navigate(['/login']);
        UtilService.sendMessage(
          UtilService.translation.instant('SessionExpired'),
          false
        );
        return false;
      } else if (next.data.roles && next.data.roles.indexOf(role) === -1) {
        UtilService.sendMessage(
          UtilService.translation.instant('AuthRequired'),
          false
        );
        this.router.navigate(['']);
        return false;
      }
      return true;
    }
  }
}
