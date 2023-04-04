import { Customer } from './customer.model';
import { OrderDetail } from './order-detail.model';

export class Order {
  id: number;
  customer: Customer;
  orderDate: Date;
  orderDetails: OrderDetail[];
}
