// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/rides/search/search.component')
      .then(m => m.SearchComponent)
  },
  {
    path: 'rides/create',
    canActivate: [authGuard, roleGuard('driver')],
    loadComponent: () => import('./features/rides/create/create-ride.component')
      .then(m => m.CreateRideComponent as any)
  },
  {
    path: 'bookings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bookings/bookings.component')
      .then(m => m.BookingsComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component')
      .then(m => m.ProfileComponent)
  },
  { path: '**', redirectTo: '/login' }
];