import { Component, OnInit } from "@angular/core";
import { Item } from "../models/item.model";
import { ItemService } from "../services/item.service";

@Component({
  selector: "app-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.css"],
})
export class ItemsComponent implements OnInit {
  items: Item[];
  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.itemService.getListItems().subscribe(
      (response) => {
        this.items = response;
        // console.log(response);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
