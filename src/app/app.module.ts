import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ItemsComponent } from "./items/items.component";
import { LoginComponent } from "./login/login.component";
import { HttpClientModule } from "@angular/common/http";
import { ItemComponent } from "./items/item/item.component";
import { HeaderComponent } from "./header/header.component";
import { ErrorPageComponent } from "./error-page/error-page.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorPageComponent,
    LoginComponent,
    ItemsComponent,
    ItemComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
