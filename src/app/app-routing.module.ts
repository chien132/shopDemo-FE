import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemPanelComponent } from './admin-panel/item-panel/item-panel.component';
import { OrderPanelComponent } from './admin-panel/order-panel/order-panel.component';
import { CartComponent } from './cart/cart.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ItemsComponent } from './items/items.component';
import { LoginComponent } from './login/login.component';
import { OrderListComponent } from './order-list/order-list.component';
import { CartResolver } from './services/cart.resolver';
import { AuthorizeGuard } from './services/auth/authorize-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: LoginComponent,
  },
  {
    path: 'adminpanel',
    component: null,
    canActivate: [AuthorizeGuard],
    data: { roles: ['ROLE_OWNER'] },
    children: [
      {
        path: 'item',
        component: ItemPanelComponent,
      },
      {
        path: 'order',
        component: OrderPanelComponent,
      },
    ],
  },
  {
    path: 'items',
    component: ItemsComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthorizeGuard],
    data: { roles: ['ROLE_CUSTOMER'] },
    resolve: { cart: CartResolver },
  },
  {
    path: 'orders',
    canActivate: [AuthorizeGuard],
    data: { roles: ['ROLE_CUSTOMER'] },
    component: OrderListComponent,
  },
  {
    path: 'not-found',
    component: ErrorPageComponent,
  },
  {
    path: '',
    redirectTo: '/items',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
