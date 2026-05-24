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

  // Prevent infinite loop
  const targetUrl = state.url;

  if (authService.hasRole('Admin') && targetUrl !== '/dashboard-admin') {
    router.navigate(['/dashboard-admin']);
    return false;
  } else if (authService.hasRole('Commercial') && targetUrl !== '/dashboard') {
    router.navigate(['/dashboard']);
    return false;
  } else if (authService.hasRole('Client_User') && targetUrl !== '/dashboard-client') {
    router.navigate(['/dashboard-client']);
    return false;
  } else if (targetUrl !== '/login' && !authService.hasRole('Commercial') && !authService.hasRole('Client_User') && !authService.hasRole('Admin')) {
    router.navigate(['/login']);
    return false;
  }

  // If they are already on the fallback URL but still unauthorized, just return false so it doesn't loop
  return false;
};

