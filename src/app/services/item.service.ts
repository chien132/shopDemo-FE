import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { Observable } from "rxjs";
import { Item } from "../models/item.model";

@Injectable({
  providedIn: "root",
})
export class ItemService {
  baseUrl = "http://localhost:8080/api/items";

  @Output() itemFilter = new EventEmitter();
  currentSearch: string = "";

  constructor(private http: HttpClient) {
    this.itemFilter.subscribe((search) => {
      this.currentSearch = search;
    });
  }

  getListItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}`);
  }

  create(item: Item): Observable<Item> {
    return this.http.post<Item>(this.baseUrl, item);
  }
  update(item: Item): Observable<Item> {
    return this.http.put<Item>(this.baseUrl, item);
  }

  deleteItem(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, { observe: "response" });
  }
}
