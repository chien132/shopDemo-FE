import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
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
  @ViewChild("nameInput", { static: true }) nameInputRef: ElementRef;
  @ViewChild("priceInput", { static: true }) priceInputRef: ElementRef;
  currentItem: Item = null;
  constructor(
    private itemService: ItemService,
    private modalService: ModalService
  ) {}

  @ViewChild("modal", { read: ViewContainerRef, static: true })
  entry!: ViewContainerRef;
  sub!: Subscription;

  ngOnInit() {
    this.onRefresh();
  }

  onRefresh() {
    this.itemService.getListItems().subscribe(
      (res) => {
        this.items = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  valid() {
    if (this.nameInputRef.nativeElement.value.length === 0) {
      UtilService.sendMessage("Name must not empty!", false);
      return false;
    }
    this.priceInputRef.nativeElement.value =
      this.priceInputRef.nativeElement.value.replace(/[^0-9]/g, "");
    if (this.priceInputRef.nativeElement.value < 0) {
      UtilService.sendMessage("Price must be greater than 0!", false);
      return false;
    }
    return true;
  }

  onAdd() {
    const modal = $(`#addItemModal`).modal("show");
    modal.find(".modal-title").html("Add item ");
    this.nameInputRef.nativeElement.value = "";
    this.priceInputRef.nativeElement.value = "0";
    this.currentItem = null;
  }

  onEdit(item: Item) {
    const modal = $(`#addItemModal`).modal("show");
    modal.find(".modal-title").html("Edit " + item.name);
    this.nameInputRef.nativeElement.value = item.name;
    this.priceInputRef.nativeElement.value = item.price;
    this.currentItem = item;
  }

  onModalConfirm() {
    if (!this.valid()) {
      return;
    }
    if (!this.currentItem) {
      const newItem: Item = {
        id: 0,
        name: this.nameInputRef.nativeElement.value,
        price: +this.priceInputRef.nativeElement.value,
      };
      this.itemService.create(newItem).subscribe(
        (res) => {
          UtilService.sendMessage(`Created item ${res.id}: ${res.name}`, true);
          this.items.push(res);
        },
        (err) => {
          UtilService.sendMessage(err.error.message, false);
        }
      );
    } else {
      this.currentItem.name = this.nameInputRef.nativeElement.value;
      this.currentItem.price = +this.priceInputRef.nativeElement.value;
      this.itemService.update(this.currentItem).subscribe(
        (res) => {
          UtilService.sendMessage(`Updated item ${res.id}: ${res.name}`, true);
        },
        (err) => {
          UtilService.sendMessage(err.error.message, false);
        }
      );
    }
    this.currentItem = null;
    UtilService.hideModal("addItemModal");
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
            if (res.status == 200) {
              UtilService.sendMessage(item.name + " has been deleted!", true);
              this.items.splice(this.items.indexOf(item), 1);
            }
          },
          (err) => {
            UtilService.sendMessage(err.error.message, false);
            console.log(err);
          }
        );
      });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
