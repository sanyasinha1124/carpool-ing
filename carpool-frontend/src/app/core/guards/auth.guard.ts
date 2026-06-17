// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};

export const roleGuard = (role: string): CanActivateFn => () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const user   = auth.currentUser();
  if (user?.role === role || user?.role === 'admin') return true;
  router.navigate(['/dashboard']);
  return false;
};