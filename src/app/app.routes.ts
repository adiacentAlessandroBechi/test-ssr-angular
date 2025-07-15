import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Client } from './pages/client/client';
import { Static } from './pages/static/static';
import { Ssr } from './pages/ssr/ssr';
import { Product } from './pages/static/product/product';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },

  {
    path: 'home',
    component: Home,
  },
  {
    path: 'client',
    component: Client,
  },
  {
    path: 'static',
    component: Static,
    children: [
      {
        path: ':id',
        component: Product,
      },
    ],
  },
  {
    path: 'ssr',
    component: Ssr,
  },
];
