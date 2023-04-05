import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cart } from '../models/cart.model';
import { JwtService } from './auth/jwt.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = 'http://localhost:8080/api/carts';
  cartWatcher = new Subject<Cart>();

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/${this.jwtService.getId()}`);
  }

  addItem(cartDetail: CartDetailReq) {
    this.http.post<Cart>(this.baseUrl, cartDetail).subscribe(
      (res) => {
        this.cartWatcher.next(res);
      },
      (err) => {
        UtilService.errorHandler(err);
      }
    );
  }
  updateItem(index, cartDetail: CartDetailUpdateReq, cart: Cart) {
    this.http.put(this.baseUrl, cartDetail, { observe: 'response' }).subscribe(
      (res) => {
        if (res.status == 204) {
          cart.cartDetails[index].quantity = cartDetail.quantity;
          this.cartWatcher.next(cart);
        }
      },
      (err) => UtilService.errorHandler(err)
    );
  }
  deleteItem(index, id: number, cart: Cart) {
    this.http
      .delete(`${this.baseUrl}/${id}`, { observe: 'response' })
      .subscribe(
        (res) => {
          if (res.status == 200) {
            cart.cartDetails.splice(index, 1);
            this.cartWatcher.next(cart);
          }
        },
        (err) => {
          UtilService.errorHandler(err);
        }
      );
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
