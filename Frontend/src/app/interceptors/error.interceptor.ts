import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Functional HTTP error interceptor.
 * Handles 401 (auto-logout), 403 (unauthorized page), and 500 (toast error).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      switch (error.status) {
        case 401:
          authService.logout();
          toast.warning('Session expired. Please login again.', 'Session Expired');
          break;

        case 403:
          router.navigate(['/unauthorized']);
          toast.error('You do not have permission to access this resource.', 'Access Denied');
          break;

        case 0:
          toast.error('Unable to connect to the server. Please check your connection.', 'Connection Error');
          break;

        default:
          const message = error.error?.message || 'An unexpected error occurred.';
          toast.error(message, 'Error');
          break;
      }

      return throwError(() => error);
    })
  );
};
