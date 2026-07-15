import { Routes } from '@angular/router';

export const routes: Routes = [
  // Demo route: smoke-tests the PrimeNG + Transloco + Tailwind wiring. When
  // starting a real app from this template, delete the primeng-test component,
  // this route, and its keys in public/i18n/*.json.
  {
    path: '',
    loadComponent: () => import('./primeng-test/primeng-test').then((m) => m.PrimeNgTest),
  },
];
