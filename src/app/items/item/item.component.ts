import { Component, Input, OnInit } from "@angular/core";
import { CartService } from "src/app/services/cart.service";
import { JwtService } from "src/app/services/auth/jwt.service";
import { UtilService } from "src/app/services/util.service";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.css"],
})
export class ItemComponent implements OnInit {
  @Input() item;
  customerId = +this.jwtService.getId();
  constructor(
    private cartService: CartService,
    private jwtService: JwtService
  ) {}

  ngOnInit() {}

  addToCart() {
    let role = this.jwtService.getRole();
    if (!role || role === "ROLE_OWNER") {
      UtilService.sendMessage(
        "You have to login as Customer to do this",
        false
      );
      return;
    }
    let itemReq = {
      customerId: this.customerId,
      itemId: this.item.id,
      quantity: 1,
    };

    this.cartService.addItem(itemReq).subscribe(
      (res) => {
        UtilService.sendMessage(
          "Added " +
            itemReq.quantity +
            " " +
            res.cartDetails.find((detail) => detail.item.id == itemReq.itemId)
              .item.name +
            " to cart!",
          true
        );
      },
      (err) => {
        UtilService.sendMessage(err.error.message, false);
      }
    );
  }
}
