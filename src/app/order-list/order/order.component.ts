import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit, OnDestroy {
  @Input('order') order: Order;
  @Input('total') total: { number: number; value: number };
  orderSub;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderSub = this.orderService.selectOrder.subscribe((o) => {
      this.order = o;
      this.total = this.orderService.getTotal(o);
    });
  }

  ngOnDestroy() {
    this.orderSub.unsubscribe();
  }
}
