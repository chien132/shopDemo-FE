import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
})
export class ModalComponent {
  constructor() {}

  @Input() title: string = "";
  @Input() body: string = "";
  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  closeMe() {
    console.log("canceled!");
    this.closeMeEvent.emit();
  }
  confirm() {
    console.log("confirmed!");
    this.confirmEvent.emit();
  }
}
