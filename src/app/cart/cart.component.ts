import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../models/cart.model';
import { CartService } from '../services/cart.service';
import { JwtService } from '../services/auth/jwt.service';
import { OrderService } from '../services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart;
  total: number;
  totalItem: number;
  customerId: number = -1;
  watcher: Subscription;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ cart }) => {
      this.updateCart(cart);
    });
    this.watcher = this.cartService.cartWatcher.subscribe((cart) => {
      this.updateCart(cart);
    });
    this.customerId = +this.jwtService.getId();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  updateCart(cart) {
    this.cart = cart;

    if (cart.cartDetails.length > 0) {
      this.total = cart.cartDetails
        .map((a) => a.quantity * a.item.price)
        .reduce(function (a, b) {
          return a + b;
        });
      this.totalItem = cart.cartDetails
        .map((a) => a.quantity)
        .reduce(function (a, b) {
          return a + b;
        });
    } else {
      this.total = 0;
      this.totalItem = 0;
    }
  }

  onPlus(itemId: number) {
    this.cartService.addItem({
      customerId: +this.jwtService.getId(),
      itemId: itemId,
      quantity: 1,
    });
  }

  onMinus(itemId: number) {
    this.cartService.addItem({
      customerId: +this.jwtService.getId(),
      itemId: itemId,
      quantity: -1,
    });
  }
  onKeyUp(event) {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  }
  onQuantityFocusOut(index, cartDetailId, event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    if (event.target.value < 1) {
      event.target.value = 1;
    }
    let quantity: number = event.target.value;
    this.cartService.updateItem(
      index,
      {
        cartDetailId: cartDetailId,
        quantity: quantity,
      },
      this.cart
    );
  }

  onDelete(index: number, id: number) {
    this.cartService.deleteItem(index, id, this.cart);
  }

  onCheckout() {
    this.orderService.confirmOrder(this.customerId);
  }
}
