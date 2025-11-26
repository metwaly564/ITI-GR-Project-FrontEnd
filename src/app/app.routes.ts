import { Routes } from '@angular/router';
import { SingleProduct } from './components/pages/single-product/single-product';
import { Home } from './components/pages/home/home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'home', component: Home },
  { path: 'singleproduct/:id', component: SingleProduct },

  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/pages/profile/profile').then((m) => m.ProfileComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register').then((m) => m.Register),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
