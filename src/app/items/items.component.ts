import { Component, OnInit } from "@angular/core";
import { Item } from "../models/item.model";
import { ItemService } from "../services/item.service";

@Component({
  selector: "app-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.css"],
})
export class ItemsComponent implements OnInit {
  allItems: Item[];
  items: Item[];
  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.itemService.getListItems().subscribe(
      (response) => {
        this.allItems = response;
        this.items = response.filter((item) =>
          new RegExp(this.itemService.currentSearch, "i").test(
            item.name.replace(/[^\w]/gi, "")
          )
        );
      },
      (err) => {
        console.log(err);
      }
    );

    this.itemService.itemFilter.subscribe((search) => {
      this.items = this.allItems.filter((item) =>
        new RegExp(search, "i").test(item.name.replace(/[^\w]/gi, ""))
      );
    });
  }
}
