import { Component, Input, OnInit } from "@angular/core";
import { Order } from "src/app/models/order.model";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  @Input("index") index: number;
  @Input("order") order: Order;
  constructor() {}

  ngOnInit() {}
}
