import { Injectable } from '@angular/core';
declare const $: any;

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  static sendMessage(message: string, success: boolean) {
    if (!success) {
      $('body').find('.toast-header').first().addClass('bg-danger');
      $('body').find('#toastHeader').first().html('Failed');
    } else {
      $('body').find('.toast-header').first().removeClass('bg-danger');
      $('body').find('.toast-header').first().addClass('bg-success');
      $('body').find('#toastHeader').first().html('Success');
    }
    $('body').find('#toastMessage').first().html(message);
    $('body').find('#liveToast').first().toast('show');
  }

  static hideModal(id: string) {
    $(`#${id}`).modal('hide');
  }
}
