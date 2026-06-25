import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Functional HTTP interceptor — attaches JWT Bearer token to all API requests.
 * Skips token for login & register endpoints.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip auth header for login/register endpoints
  const skipUrls = ['/Auth/login', '/Auth/register'];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));

  if (!shouldSkip && authService.isLoggedIn()) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
