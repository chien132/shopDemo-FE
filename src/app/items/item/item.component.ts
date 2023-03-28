import { Component, Input, OnInit } from "@angular/core";
import { StorageService } from "src/app/services/auth/storage.service";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.css"],
})
export class ItemComponent implements OnInit {
  @Input() item;
  customerId = +this.storageService.getItem("customerId");
  constructor(
    private cartService: CartService,
    private storageService: StorageService
  ) {}

  ngOnInit() {}

  addToCart() {
    let itemReq = {
      customerId: this.customerId,
      itemId: this.item.id,
      quantity: 1,
    };
    console.log(itemReq);

    if (this.customerId >= 0) {
      this.cartService.addItem(itemReq).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
