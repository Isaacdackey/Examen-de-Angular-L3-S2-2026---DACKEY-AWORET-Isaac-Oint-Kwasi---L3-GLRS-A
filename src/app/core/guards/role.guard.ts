import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

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
  const hasRequiredRole = user && requiredRoles.includes(user.role);
  
  if (!hasRequiredRole) {
    if (user?.role === 'AGENT' || user?.role === 'ADMIN') {
      router.navigate(['/admin/wallets']);
    } else {
      router.navigate(['/dashboard']);
    }
    return false;
  }
  
  return true;
};

export const agentGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  
  const user = authService.getCurrentUser();
  if (user?.role === 'AGENT' || user?.role === 'ADMIN') {
    return true;
  }
  
  router.navigate(['/dashboard']);
  return false;
};

export const clientGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  
  const user = authService.getCurrentUser();
  if (user?.role === 'CLIENT') {
    return true;
  }
  
  router.navigate(['/admin/wallets']);
  return false;
};
