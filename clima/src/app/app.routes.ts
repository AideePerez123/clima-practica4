import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/home/presentation/home.page').then(m => m.HomePage) },
  { path: 'clima', loadComponent: () => import('./features/weather/presentation/clima.page').then(m => m.ClimaPage) },
  { path: 'registro', loadComponent: () => import('./features/photo-record/presentation/registro.page').then(m => m.RegistroPage) },
];