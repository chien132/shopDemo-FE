import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Item } from '../models/item.model';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit, OnDestroy {
  items: Item[];
  sub: Subscription;

  page = 1;
  count = 0;
  pageSize = 8;
  pageSizes = [4, 8, 16];
  sort = 'iddesc';
  sorts = ['iddesc', 'idasc', 'nameasc', 'namedesc', 'priceasc', 'pricedesc'];

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.retrieveItems();
    this.sub = this.itemService.itemFilter.subscribe((searchStr) => {
      this.page = 1;
      this.retrieveItems();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  getRequestParams(search, page, pageSize, sort): any {
    let params = {};
    if (search) {
      params[`search`] = search;
    }
    if (page) {
      params[`page`] = page - 1;
    }
    if (pageSize) {
      params[`size`] = pageSize;
    }
    if (sort) {
      params[`sort`] = sort;
    }
    return params;
  }

  retrieveItems() {
    const params = this.getRequestParams(
      this.itemService.currentSearch,
      this.page,
      this.pageSize,
      this.sort
    );

    this.itemService.getAllPaginated(params).subscribe(
      (response) => {
        const { items, totalItems } = response;
        this.items = items;
        this.count = totalItems;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
    // this.itemService
    //   .getListItemsByNameLike(this.itemService.currentSearch)
    //   .subscribe((res) => {
    //     this.items = res;
    //   });
  }

  handlePageChange(event): void {
    this.page = event;
    this.retrieveItems();
  }

  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveItems();
  }
  handleSortChange(event): void {
    this.sort = event.target.value;
    this.page = 1;
    this.retrieveItems();
  }
}
