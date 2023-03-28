import { CartDetail } from "./cart-detail.model";
import { Customer } from "./customer.model";

export class Cart {
  id: number;
  customer: Customer;
  cartDetails: CartDetail[];
}
