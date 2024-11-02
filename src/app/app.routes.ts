import {Routes} from '@angular/router';

export const AppRoutes: Routes = [
  { path: 'cart', title: 'Shopping Cart', loadComponent: () => import('./cart/cart.component').then(c => c.CartComponent) },
  { path: 'products', title: 'Product Cards App', loadComponent: () => import('./product-list/product-list.component').then(p => p.ProductListComponent) },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];
