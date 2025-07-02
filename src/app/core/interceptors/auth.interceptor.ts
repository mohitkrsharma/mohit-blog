import {
  HttpRequest,
  HttpEvent,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);

  // Get token from localStorage
  const token = localStorage.getItem('auth_token');

  // If token exists, add it to the request headers
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Continue with the modified request and handle errors
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // If error is 401 (Unauthorized) or 403 (Forbidden), redirect to landing page
      if (error.status === 401 || error.status === 403) {
        router.navigate(['/']);
      }
      return throwError(() => error);
    })
  );
};
