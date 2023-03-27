import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { ItemsComponent } from "./items/items.component";
import { LoginComponent } from "./login/login.component";

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
