import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cart } from "../models/cart.model";
import { CartService } from "../services/cart.service";
import { JwtService } from "../services/jwt.service";
import { OrderService } from "../services/order.service";
import { UtilService } from "../services/util.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  cart: Cart;
  total: number;
  totalItem: number;
  customerId = -1;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private jwtService: JwtService
  ) {}

  calculateTotal() {
    if (this.cart.cartDetails.length > 0) {
      this.total = this.cart.cartDetails
        .map((a) => a.quantity * a.item.price)
        .reduce(function (a, b) {
          return a + b;
        });
      this.totalItem = this.cart.cartDetails
        .map((a) => a.quantity)
        .reduce(function (a, b) {
          return a + b;
        });
    } else {
      this.total = 0;
      this.totalItem = 0;
    }
  }

  ngOnInit() {
    this.route.data.subscribe(({ cart }) => {
      this.cart = cart;
      this.calculateTotal();
    });
    this.customerId = +this.jwtService.getId();
  }

  onPlus(itemId: number) {
    this.cartService
      .addItem({
        customerId: +this.jwtService.getId(),
        itemId: itemId,
        quantity: 1,
      })
      .subscribe((res) => {
        this.cart = res;
        this.calculateTotal();
      }),
      (err) => console.log(err);
  }

  onMinus(itemId: number) {
    this.cartService
      .addItem({
        customerId: +this.jwtService.getId(),
        itemId: itemId,
        quantity: -1,
      })
      .subscribe((res) => {
        this.cart = res;
        this.calculateTotal();
      }),
      (err) => console.log(err);
  }
  onKeyUp(event) {
    if (event.keyCode === 13) {
      console.log(event);
      event.target.blur();
    }
  }
  onQuantityFocusOut(index, cartDetailId, event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, "");
    if (event.target.value < 1) {
      event.target.value = 1;
    }
    let quantity: number = event.target.value;
    this.cartService
      .updateItem({
        cartDetailId: cartDetailId,
        quantity: quantity,
      })
      .subscribe((res) => {
        if (res.status == 204) {
          this.cart.cartDetails[index].quantity = quantity;
          this.calculateTotal();
        }
      }),
      (err) => console.log(err);
  }

  onDelete(index: number, id: number) {
    this.cartService.deleteItem(id).subscribe(
      (res) => {
        if (res.status == 200) {
          this.cart.cartDetails.splice(index, 1);
          this.calculateTotal();
        }
      },
      (err) => {
        UtilService.sendMessage(err.error.message, false);
      }
    );
  }

  onCheckout() {
    this.orderService.confirmOrder(this.customerId).subscribe(
      (res) => {
        UtilService.sendMessage("Your order has been confirmed!", true);
        this.router.navigate(["/orders"]);
        UtilService.hideModal("confirmOrderModal");
      },
      (err) => {
        UtilService.sendMessage(err.error.message, false);
      }
    );
  }
}
