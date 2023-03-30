import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { Item } from "src/app/models/item.model";
import { ItemService } from "src/app/services/item.service";
import { UtilService } from "src/app/services/util.service";
import { ModalService } from "src/app/shared/modal.service";
declare var $: any;
@Component({
  selector: "app-item-panel",
  templateUrl: "./item-panel.component.html",
  styleUrls: ["./item-panel.component.css"],
})
export class ItemPanelComponent implements OnInit {
  items: Item[];
  constructor(
    private itemService: ItemService,
    private modalService: ModalService
  ) {}

  ///////////
  @ViewChild("modal", { read: ViewContainerRef, static: true })
  entry!: ViewContainerRef;
  sub!: Subscription;

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
  createModal() {
    this.sub = this.modalService
      .openModal(this.entry, "Are you sure ?", "click confirm or close")
      .subscribe((v) => {
        //your logic
        console.log("running on panel");
      });
  }
  /////////

  ngOnInit() {
    this.itemService.getListItems().subscribe(
      (res) => {
        this.items = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onDelete(item: Item) {
    this.sub = this.modalService
      .openModal(
        this.entry,
        "Warning !",
        `Are you sure to delete "${item.name}" ?`
      )
      .subscribe((v) => {
        UtilService.hideModal("confirmModal");
        this.itemService.deleteItem(item.id).subscribe(
          (res) => {
            UtilService.sendMessage(item.name + " has been deleted!", true);
            this.items.splice(this.items.indexOf(item), 1);
          },
          (err) => {
            UtilService.sendMessage(err.error.message, false);
            console.log(err);
          }
        );
      });
  }
}
