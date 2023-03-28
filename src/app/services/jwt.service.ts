import { Injectable } from "@angular/core";
import jwt_decode from "jwt-decode";
import { StorageService } from "./auth/storage.service";

@Injectable({
  providedIn: "root",
})
export class JwtService {
  jwtToken = this.storageService.getItem("jwtToken");
  decodedToken: { [key: string]: string };

  constructor(private storageService: StorageService) {
    this.storageService.watchStorage().subscribe((data) => {
      // if (data == "added" || data == "removed") {
      this.jwtToken = this.storageService.getItem("jwtToken");
      // console.log(this.jwtToken);
      // }
    });
  }

  decodeToken() {
    this.decodedToken = this.jwtToken ? jwt_decode(this.jwtToken) : null;
  }

  getDecodeToken() {
    return jwt_decode(this.jwtToken);
  }

  getUsername() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.sub : null;
  }

  getId() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.id : null;
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.exp : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = +this.getExpiryTime();
    if (expiryTime) {
      return 1000 * expiryTime - new Date().getTime() < 5000;
    } else {
      return false;
    }
  }
}
