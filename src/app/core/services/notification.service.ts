import { Injectable, signal, computed } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toastsSignal = signal<ToastMessage[]>([]);
  private idCounter = 0;

  public readonly toasts = this.toastsSignal.asReadonly();
  
  public readonly toastCount = computed(() => this.toastsSignal().length);
  
  showSuccess(message: string, title?: string, duration: number = 5000) {
    this.addToast({
      type: 'success',
      message,
      title: title || 'Succès',
      duration
    });
  }
  
  
  showError(message: string, title?: string, duration: number = 8000) {
    this.addToast({
      type: 'error',
      message,
      title: title || 'Erreur',
      duration
    });
  }
  
  showWarning(message: string, title?: string, duration: number = 6000) {
    this.addToast({
      type: 'warning',
      message,
      title: title || 'Attention',
      duration
    });
  }
  
  showInfo(message: string, title?: string, duration: number = 4000) {
    this.addToast({
      type: 'info',
      message,
      title: title || 'Information',
      duration
    });
  }
  
  private addToast(toast: Omit<ToastMessage, 'id'>) {
    const id = (++this.idCounter).toString();
    const newToast: ToastMessage = { ...toast, id };
    
    this.toastsSignal.update(current => [...current, newToast]);
  
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, toast.duration);
    }
  }
  
  removeToast(id: string) {
    this.toastsSignal.update(current => current.filter(t => t.id !== id));
  }
  
  clearAll() {
    this.toastsSignal.set([]);
  }
  

  confirmAction(message: string, onConfirm: () => void, onCancel?: () => void) {
    this.showInfo(message);
    setTimeout(onConfirm, 1000);
  }
  
  formatApiError(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Une erreur inattendue est survenue';
  }
}
