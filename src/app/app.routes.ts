import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { SingleProduct } from './components/single-product/single-product';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'singleproduct/:id', component: SingleProduct },

  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login')
      .then(m => m.Login)
  },
  
  { 
    path: 'profile', 
    loadComponent: () => import('./pages/profile/profile')
      .then(m => m.ProfileComponent)
  },

  // Fallback route
  { path: '**', redirectTo: 'home' }
];
