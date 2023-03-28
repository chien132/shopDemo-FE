import { Item } from "./item.model";

export class OrderDetail {
  id: number;
  quantity: number;
  item: Item;
  orderId: number;
}
