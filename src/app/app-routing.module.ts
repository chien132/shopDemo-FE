import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CartComponent } from "./cart/cart.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { ItemsComponent } from "./items/items.component";
import { LoginComponent } from "./login/login.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { CartResolver } from "./services/cart.resolver";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "items",
    component: ItemsComponent,
  },
  {
    path: "cart",
    component: CartComponent,
    resolve: { cart: CartResolver },
  },
  {
    path: "orders",
    component: OrderListComponent,
  },
  {
    path: "not-found",
    component: ErrorPageComponent,
  },
  {
    path: "**",
    redirectTo: "/not-found",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
