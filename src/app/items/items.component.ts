import { Component, OnInit } from "@angular/core";
import { HttpService } from "../services/http.service";
import { Item } from "../models/item.model";

@Component({
  selector: "app-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.css"],
})
export class ItemsComponent implements OnInit {
  items: Item[];
  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.getCustomerContent().subscribe(
      (response) => {
        // this.items = response;
        console.log(response);
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }
}
