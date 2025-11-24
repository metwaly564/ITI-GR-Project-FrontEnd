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

    {path: 'login', loadComponent: () => import('./components/auth/login/login').then(m => m.Login)},
    {path:'about', loadComponent: () => import('./pages/about/about').then(m => m.About)},
    {path:'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact)},
    {path:'profile', loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent)},


];