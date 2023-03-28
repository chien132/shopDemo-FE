import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../models/order.model";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  baseUrl = "http://localhost:8080/api/orders";
  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}/${localStorage.getItem("customerId")}`
    );
  }
}
