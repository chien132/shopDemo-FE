import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Item } from '../models/item.model';
import { catchError } from 'rxjs/operators';
import { UtilService } from './util.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  baseUrl = environment.backendURL + 'items';

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

  getAllPaginated(params): Observable<{ items: Item[]; totalItems: number }> {
    return this.http.get<{ items: Item[]; totalItems: number }>(
      `${this.baseUrl}/searchPaginated`,
      { params }
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
    return this.http.delete(`${this.baseUrl}/${id}`, { observe: 'response' });
  }
}
