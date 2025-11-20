import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'home', component: Home },

    {path: 'login', loadComponent: () => import('./components/auth/login/login').then(m => m.Login)},

];
