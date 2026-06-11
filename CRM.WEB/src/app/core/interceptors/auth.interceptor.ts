import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const token = authService.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      // Ne pas traiter le 401 du login (identifiants invalides) comme une session expiree
      const isLoginAttempt = req.url.toLowerCase().includes('/api/login');
      if (error.status === 401 && !isLoginAttempt) {
        notificationService.info('Votre session a expiré. Merci de vous reconnecter.');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
