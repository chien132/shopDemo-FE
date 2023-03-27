import { Customer } from "./customer.model";

export class Order {
  id: number;
  customer: Customer;
  orderDate: Date;
}
