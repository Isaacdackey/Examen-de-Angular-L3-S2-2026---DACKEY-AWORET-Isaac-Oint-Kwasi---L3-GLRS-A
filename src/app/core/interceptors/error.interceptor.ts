import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../../auth/services/auth.service';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  
  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'Une erreur est survenue';
      let errorDetails = '';
      

      if (error.error?.message) {
        errorMessage = error.error.message;
        errorDetails = error.error.details || '';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      
      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de se connecter au serveur';
          break;
          
        case 400:
          errorMessage = 'Requête invalide: ' + (error.error?.message || errorMessage);
          break;
          
        case 401:
          errorMessage = 'Session expirée. Veuillez vous reconnecter';
          if (!req.url.includes('/login')) {
            const authService = inject(AuthService);
            setTimeout(() => authService.logout(), 1000);
          }
          break;
          
        case 403:
          errorMessage = 'Accès non autorisé. Vous n\'avez pas les droits nécessaires';
          break;
          
        case 404:
          errorMessage = 'Ressource non trouvée: ' + (error.error?.message || errorMessage);
          break;
          
        case 409:
          errorMessage = 'Conflit: ' + (error.error?.message || 'Cette ressource existe déjà');
          break;
          
        case 422:
          errorMessage = 'Erreur de validation: ' + (error.error?.message || errorMessage);
          break;
          
        case 500:
          errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard';
          break;
          
        case 503:
          errorMessage = 'Service indisponible. Veuillez réessayer plus tard';
          break;
          
        default:
          errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
      }
      

      if (errorDetails) {
        console.error('Détails de l\'erreur:', errorDetails);
      }
      
      
      notificationService.showError(errorMessage);
      
     
      console.error('Erreur HTTP:', {
        status: error.status,
        statusText: error.statusText,
        message: errorMessage,
        error: error.error,
        url: req.url
      });
      
      return throwError(() => error);
    })
  );
};
