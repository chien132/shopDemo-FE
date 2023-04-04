import { Item } from './item.model';

export class CartDetail {
  id: number;
  orderId: number;
  item: Item;
  quantity: number;
  dateAdded: Date;
}
