import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Acces autorise uniquement si l utilisateur possede au moins un des roles demands.
 */
export function rolesGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }
    const allowed = allowedRoles.some((role) => authService.hasRole(role));
    if (!allowed) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  };
}
