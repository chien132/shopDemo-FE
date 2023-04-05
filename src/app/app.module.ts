import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemsComponent } from './items/items.component';
import { LoginComponent } from './login/login.component';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ItemComponent } from './items/item/item.component';
import { HeaderComponent } from './header/header.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { CartComponent } from './cart/cart.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderComponent } from './order-list/order/order.component';
import { ItemPanelComponent } from './admin-panel/item-panel/item-panel.component';
import { OrderPanelComponent } from './admin-panel/order-panel/order-panel.component';
import { ModalComponent } from './shared/modal/modal.component';
import { FilterPipe } from './shared/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/labels/', suffix: '.json' },
    { prefix: './assets/i18n/messages/', suffix: '.json' },
    { prefix: './assets/i18n/validation/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorPageComponent,
    LoginComponent,
    ItemsComponent,
    ItemComponent,
    CartComponent,
    OrderListComponent,
    OrderComponent,
    ItemPanelComponent,
    OrderPanelComponent,
    ModalComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [ModalComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
