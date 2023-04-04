import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  @Input('order') order: Order;
  @Input('total') total: { number: number; value: number };

  constructor(private orderService: OrderService) {}

  // calculateTotal() {
  //   if (this.order != null && this.order.orderDetails.length > 0) {
  //     this.total = this.order.orderDetails
  //       .map((a) => a.quantity * a.item.price)
  //       .reduce(function (a, b) {
  //         return a + b;
  //       });
  //     this.totalItem = this.order.orderDetails
  //       .map((a) => a.quantity)
  //       .reduce(function (a, b) {
  //         return a + b;
  //       });
  //   } else {
  //     this.total = 0;
  //     this.totalItem = 0;
  //   }
  // }

  ngOnInit() {
    this.orderService.selectOrder.subscribe((o) => {
      this.order = o;
      this.total = this.orderService.getTotal(o);
    });
  }
}
