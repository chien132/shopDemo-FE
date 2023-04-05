import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Order } from '../models/order.model';
import { JwtService } from './auth/jwt.service';
import { UtilService } from './util.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = 'http://localhost:8080/api/orders';
  selectOrder = new Subject<Order>();

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

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router
  ) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl).pipe(
      catchError((error) => {
        return UtilService.errorHandler(error);
      })
    );
  }

  getOrdersByCustomer(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/${this.jwtService.getId()}`);
  }

  confirmOrder(customerId: number) {
    UtilService.hideModal('confirmOrderModal');
    this.http.post<Order>(this.baseUrl, customerId).subscribe(
      (res) => {
        UtilService.sendMessage(
          UtilService.translation.instant('OrderConfirmed'),
          true
        );
        this.router.navigate(['/orders']);
        UtilService.hideModal('confirmOrderModal');
      },
      (err) => {
        if (err.status === 400) {
          UtilService.sendMessage(
            UtilService.translation.instant('CantCheckout'),
            false
          );
        }
      }
    );
  }

  completeOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(this.baseUrl, orderId).pipe(
      catchError((error) => {
        return UtilService.errorHandler(error);
      })
    );
  }
}
