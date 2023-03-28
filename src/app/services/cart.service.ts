import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cart } from "../models/cart.model";
import { JwtService } from "./jwt.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
  baseUrl = "http://localhost:8080/api/carts";
  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/${this.jwtService.getId()}`);
  }

  addItem(cart: CartReq): Observable<Cart> {
    return this.http.post<Cart>(this.baseUrl, cart);
  }
  deleteItem(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

export interface CartReq {
  customerId: number;
  itemId: number;
  quantity: number;
}
