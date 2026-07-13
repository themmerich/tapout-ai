import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./primeng-test/primeng-test').then((m) => m.PrimeNgTest)
  }
];
