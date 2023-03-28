import { Component, OnInit } from "@angular/core";
import { Order } from "../models/order.model";
import { OrderService } from "../services/order.service";
import { UtilService } from "../services/util.service";

@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.css"],
})
export class OrderListComponent implements OnInit {
  orders: Order[];
  selectedOrder: number;
  constructor(private orderService: OrderService, private util: UtilService) {}

  ngOnInit() {
    this.orderService.getOrderList().subscribe(
      (res) => {
        this.orders = res.reverse();
        this.selectedOrder = this.orders[0].id;
      },
      (err) => {
        this.util.sendMessage(err.error.message, false);
      }
    );
  }

  onChoose(o: Order) {
    this.selectedOrder = o.id;
    this.orderService.selectOrder.emit(o);
    console.log(this.selectedOrder);
  }
}
