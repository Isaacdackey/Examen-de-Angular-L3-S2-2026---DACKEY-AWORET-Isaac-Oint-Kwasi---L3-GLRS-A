import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};


export const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    if (user?.role === 'AGENT' || user?.role === 'ADMIN') {
      router.navigate(['/admin/wallets']);
    } else {
      router.navigate(['/dashboard']);
    }
    return false;
  }
  
  return true;
};


export const roleGuard = (route: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  
  
  const requiredRoles = route.data?.['roles'] || [];
  
  if (requiredRoles.length === 0) {
    return true;
  }
  
  
  const user = authService.getCurrentUser();
  if (user && requiredRoles.includes(user.role)) {
    return true;
  }
  
  router.navigate(['/dashboard']);
  return false;
};
