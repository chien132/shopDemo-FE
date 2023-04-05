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
  constructor(private itemService: ItemService) {}
  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  ngOnInit() {
    this.itemService
      .getListItemsByNameLike(this.itemService.currentSearch)
      .subscribe((res) => {
        this.items = res;
      });
    this.sub = this.itemService.itemFilter.subscribe((searchStr) => {
      this.itemService.getListItemsByNameLike(searchStr).subscribe((res) => {
        this.items = res;
      });
    });
  }
}
