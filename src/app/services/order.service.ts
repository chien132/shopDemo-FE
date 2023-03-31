import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../models/order.model";
import { JwtService } from "./jwt.service";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  baseUrl = "http://localhost:8080/api/orders";
  @Output() selectOrder = new EventEmitter<Order>();

  getTotal(order: Order): { number: number; value: number } {
    let number = 0,
      value = 0;
    if (order != null && order.orderDetails.length > 0) {
      order.orderDetails.forEach((d) => {
        number += +d.quantity;
        value += +d.quantity * d.item.price;
      });
    }
    return { number: number, value: value };
  }

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  getOrdersByCustomer(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/${this.jwtService.getId()}`);
  }

  confirmOrder(customerId: number): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, customerId);
  }

  completeOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(this.baseUrl, orderId);
  }
}
