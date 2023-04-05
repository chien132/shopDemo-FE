import { Component, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent {
  @Input() item;
  customerId = +this.jwtService.getId();
  constructor(
    private cartService: CartService,
    private jwtService: JwtService
  ) {}

  addToCart() {
    let role = this.jwtService.getRole();
    if (!role || role === 'ROLE_OWNER') {
      UtilService.sendMessage(
        UtilService.translation.instant('LoginRequired'),
        false
      );
      return;
    }
    let itemReq = {
      customerId: this.customerId,
      itemId: this.item.id,
      quantity: 1,
    };

    this.cartService.addItem(itemReq);
    UtilService.sendMessage(
      UtilService.translation.instant('CartAdded', { name: this.item.name }),
      true
    );
  }
}
