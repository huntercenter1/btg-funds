import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'funds' },
  { path: 'funds', loadComponent: () => import('./features/funds/funds.page').then(m => m.FundsPage) },
  { path: 'history', loadComponent: () => import('./features/history/history.page').then(m => m.HistoryPage) },
  { path: '**', redirectTo: 'funds' }
];
