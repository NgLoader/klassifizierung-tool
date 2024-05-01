import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./maxim/dashboard/dashboard.component')
  },
  {
    path: 'template/:id',
    loadComponent: () => import('./maxim/template/template.component')
  }
];
