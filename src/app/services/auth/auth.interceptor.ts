import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken: string = localStorage.getItem("jwtToken");
    // set global application headers.
    req = req.clone({
      setHeaders: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        // Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    // Set headers for requests that require authorization.
    if (accessToken) {
      const authenticatedRequest = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${accessToken}`),
      });
      // Request with authorization headers
      return next.handle(authenticatedRequest);
    } else {
      // Request without authorization header
      return next.handle(req);
    }

    // return next.handle(req);
  }
}
