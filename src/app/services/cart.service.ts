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

  addItem(cartDetail: CartDetailReq): Observable<Cart> {
    return this.http.post<Cart>(this.baseUrl, cartDetail);
  }
  updateItem(cartDetail: CartDetailUpdateReq) {
    return this.http.put(this.baseUrl, cartDetail, { observe: "response" });
  }
  deleteItem(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, { observe: "response" });
  }
}

export interface CartDetailReq {
  customerId: number;
  itemId: number;
  quantity: number;
}
export interface CartDetailUpdateReq {
  cartDetailId: number;
  quantity: number;
}
