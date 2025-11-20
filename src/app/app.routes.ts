import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { SingleProduct } from './components/single-product/single-product';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'home', component: Home },
  { path: 'singleproduct/:id', component: SingleProduct },
];
