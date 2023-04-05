import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Item } from '../models/item.model';
import { catchError } from 'rxjs/operators';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  baseUrl = 'http://localhost:8080/api/items';

  itemFilter = new Subject<string>();
  currentSearch: string = '%';

  constructor(private http: HttpClient) {
    this.itemFilter.subscribe((search) => {
      this.currentSearch = search;
    });
  }

  getListItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}`).pipe(
      catchError((error) => {
        return UtilService.errorHandler(error);
      })
    );
  }

  getListItemsByNameLike(search: string): Observable<Item[]> {
    return this.http
      .get<Item[]>(`${this.baseUrl}/search`, {
        params: { search: search },
      })
      .pipe(
        catchError((error) => {
          return UtilService.errorHandler(error);
        })
      );
  }

  create(item: Item): Observable<Item> {
    return this.http.post<Item>(this.baseUrl, item);
  }
  update(item: Item): Observable<Item> {
    return this.http.put<Item>(this.baseUrl, item);
  }

  deleteItem(id: number) {
    return this.http
      .delete(`${this.baseUrl}/${id}`, { observe: 'response' })
      .pipe(
        catchError((error) => {
          return UtilService.errorHandler(error);
        })
      );
  }
}
