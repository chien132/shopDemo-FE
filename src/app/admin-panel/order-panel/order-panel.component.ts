import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalService } from 'src/app/shared/modal.service';
declare const $: any;
@Component({
  selector: 'app-order-panel',
  templateUrl: './order-panel.component.html',
  styleUrls: ['./order-panel.component.css'],
})
export class OrderPanelComponent implements OnInit {
  orders: { order: Order; total: { number: number; value: number } }[];
  constructor(
    private orderService: OrderService,
    private modalService: ModalService
  ) {}

  @ViewChild('modal', { read: ViewContainerRef, static: true })
  entry!: ViewContainerRef;
  sub!: Subscription;

  ngOnInit() {
    this.onRefresh();
  }

  onRefresh() {
    this.orderService.getAllOrders().subscribe((res) => {
      this.orders = res.map((e) => {
        return { order: e, total: this.orderService.getTotal(e) };
      });
    });
  }

  onConfirm(id: number, index: number) {
    this.sub = this.modalService
      .openModal(
        this.entry,
        'Complete Order',
        `Do you want to complete this order ?`
      )
      .subscribe((v) => {
        UtilService.hideModal('confirmModal');
        this.orderService.completeOrder(id).subscribe((res) => {
          UtilService.sendMessage('Completed order !', true);
          this.orders[index].order = res;
        });
      });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
