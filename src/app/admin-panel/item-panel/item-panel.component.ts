import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/item.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalService } from 'src/app/shared/modal.service';

declare const $: any;

@Component({
  selector: 'app-item-panel',
  templateUrl: './item-panel.component.html',
  styleUrls: ['./item-panel.component.css'],
})
export class ItemPanelComponent implements OnInit, OnDestroy {
  items: Item[];
  @ViewChild('nameInput', { static: true }) nameInputRef: ElementRef;
  @ViewChild('priceInput', { static: true }) priceInputRef: ElementRef;
  currentItem: Item = null;
  searchValue: string;

  constructor(
    private itemService: ItemService,
    private modalService: ModalService
  ) {}

  @ViewChild('modal', { read: ViewContainerRef, static: true })
  entry!: ViewContainerRef;
  sub!: Subscription;

  ngOnInit() {
    this.onRefresh();
  }

  onRefresh() {
    this.itemService.getListItems().subscribe((res) => {
      this.items = res;
    });
  }

  onPriceInput(event) {
    if (event.which != 8 && isNaN(event.key)) {
      event.preventDefault();
    }
  }

  valid() {
    if (this.nameInputRef.nativeElement.value.length === 0) {
      UtilService.sendMessage(
        UtilService.translation.instant('NameEmptyValid'),
        false
      );
      this.nameInputRef.nativeElement.focus();
      return false;
    }
    this.priceInputRef.nativeElement.value =
      this.priceInputRef.nativeElement.value.replace(/[^0-9]/g, '');
    if (this.priceInputRef.nativeElement.value < 0) {
      UtilService.sendMessage(
        UtilService.translation.instant('PriceMinValid'),
        false
      );
      this.priceInputRef.nativeElement.focus();
      return false;
    }
    return true;
  }

  onAdd() {
    const modal = $(`#addItemModal`).modal('show');
    modal
      .find('.modal-title')
      .html(UtilService.translation.instant('Item.AddItem'));
    this.nameInputRef.nativeElement.value = '';
    this.priceInputRef.nativeElement.value = '0';
    this.currentItem = null;
  }

  onEdit(item: Item) {
    const modal = $(`#addItemModal`).modal('show');
    modal
      .find('.modal-title')
      .html(UtilService.translation.instant('Item.EditItem') + item.name);
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
          UtilService.sendMessage(
            UtilService.translation.instant('ItemCreated', {
              id: res.id,
              name: res.name,
            }),
            true
          );
          this.items.push(res);
        },
        (err) => {
          UtilService.errorHandler(err);
        }
      );
    } else {
      this.currentItem.name = this.nameInputRef.nativeElement.value;
      this.currentItem.price = +this.priceInputRef.nativeElement.value;
      this.itemService.update(this.currentItem).subscribe(
        (res) => {
          UtilService.sendMessage(
            UtilService.translation.instant('ItemUpdated', {
              id: res.id,
              name: res.name,
            }),
            true
          );
        },
        (err) => {
          UtilService.errorHandler(err);
        }
      );
    }
    this.currentItem = null;
    UtilService.hideModal('addItemModal');
  }

  onDelete(item: Item) {
    this.sub = this.modalService
      .openModal(
        this.entry,
        UtilService.translation.instant('Item.Delete'),
        UtilService.translation.instant('Item.DeleteMsg') + item.name + ' ?'
      )
      .subscribe((v) => {
        UtilService.hideModal('confirmModal');
        this.itemService.deleteItem(item.id).subscribe(
          (res) => {
            if (res.status == 200) {
              UtilService.sendMessage(
                item.name + UtilService.translation.instant('ItemDeleted'),
                true
              );
              this.items.splice(this.items.indexOf(item), 1);
            }
          },
          (err) => {
            if (err.status === 500) {
              UtilService.sendMessage(
                UtilService.translation.instant('UnableDeleteItem'),
                false
              );
            }
          }
        );
      });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
