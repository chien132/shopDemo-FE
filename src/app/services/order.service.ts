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
  selectedOrder: Order;
  @Output() selectOrder = new EventEmitter<Order>();

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getOrderList(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/${this.jwtService.getId()}`);
  }

  confirmOrder(customerId: number): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, customerId);
  }
}
