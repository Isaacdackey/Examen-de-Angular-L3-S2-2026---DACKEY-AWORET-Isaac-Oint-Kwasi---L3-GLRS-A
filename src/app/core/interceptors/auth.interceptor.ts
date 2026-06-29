import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  

  const token = authService.getToken();
  const user = authService.getCurrentUser();
  
  
  let authReq = req;
  
  
  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  
  if (user?.role) {
    authReq = authReq.clone({
      setHeaders: {
        'X-User-Role': user.role
      }
    });
  }
  
  return next(authReq);
};
