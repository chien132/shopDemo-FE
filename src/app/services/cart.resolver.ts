import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class CartResolver implements Resolve<Cart> {
  constructor(private cartService: CartService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Cart> | Promise<Cart> | Cart {
    return this.cartService.getCart();
  }
}
