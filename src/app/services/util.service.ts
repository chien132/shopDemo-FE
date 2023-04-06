import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
declare const $: any;

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  static translation: TranslateService;
  static setTranslationService(translation: TranslateService) {
    UtilService.translation = translation;
  }
  static sendMessage(message: string, success: boolean) {
    if (!success) {
      $('body').find('.toast-header').first().addClass('bg-danger');
      $('body')
        .find('#toastHeader')
        .first()
        .html(this.translation.instant('Failed'));
    } else {
      $('body').find('.toast-header').first().removeClass('bg-danger');
      $('body').find('.toast-header').first().addClass('bg-success');
      $('body')
        .find('#toastHeader')
        .first()
        .html(this.translation.instant('Success'));
    }
    $('body').find('#toastMessage').first().html(message);
    $('body').find('#liveToast').first().toast('show');
  }

  static hideModal(id: string) {
    $(`#${id}`).modal('hide');
  }

  static errorHandler(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.sendMessage(UtilService.translation.instant('CantConnect'), false);
    } else {
      this.sendMessage(
        UtilService.translation.instant(error.error.message),
        false
      );
    }
    console.log(error);
    return EMPTY;
  }
  static matchValues(
    matchTo: string
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { unMatching: true };
    };
  }

  static checkSpecialChar(control: FormControl): { [s: string]: boolean } {
    return control.value.includes("'") || control.value.includes('"')
      ? { isForbidden: true }
      : null;
  }
}
