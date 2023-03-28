import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Cart } from "../models/cart.model";
import { StorageService } from "../services/auth/storage.service";
import { CartService } from "../services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  cart: Cart;
  total: number;
  totalItem: number;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private storageService: StorageService
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
  }

  onPlus(itemId: number) {
    this.cartService
      .addItem({
        customerId: +this.storageService.getItem("customerId"),
        itemId: itemId,
        quantity: 1,
      })
      .subscribe((res) => {
        this.cart = res;
        this.calculateTotal();
      }),
      (error) => console.log(error);
  }

  onMinus(itemId: number) {
    this.cartService
      .addItem({
        customerId: +this.storageService.getItem("customerId"),
        itemId: itemId,
        quantity: -1,
      })
      .subscribe((res) => {
        this.cart = res;
        this.calculateTotal();
      }),
      (error) => console.log(error);
  }
  onDelete(id: number) {
    this.cartService.deleteItem(id).subscribe((res) => {}),
      (err) => {
        console.log(err);
      };
    setTimeout(() => {
      this.cartService.getCart().subscribe(
        (res) => {
          this.cart = res;
          this.calculateTotal();
        },
        (err) => {
          console.log(err);
        }
      );
    }, 50);
  }
}
