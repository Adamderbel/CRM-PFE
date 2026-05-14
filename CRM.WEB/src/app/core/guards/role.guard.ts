import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const hasRole = requiredRoles.some(role => authService.hasRole(role));

  if (hasRole) {
    return true;
  }

  // Not authorized, redirect to the correct dashboard
  if (authService.hasRole('Admin')) {
    router.navigate(['/dashboard-admin']);
  } else {
    router.navigate(['/dashboard']);
  }
  return false;
};

