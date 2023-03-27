import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Item } from "../models/item.model";

@Injectable({
  providedIn: "root",
})
export class ItemService {
  baseUrl = "http://localhost:8080/api/items";

  constructor(private httpClient: HttpClient) {}

  getListItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(`${this.baseUrl}`);
  }

  getCustomerContent() {
    return this.httpClient.get("http://localhost:8080/api/test/admin");
  }
}
