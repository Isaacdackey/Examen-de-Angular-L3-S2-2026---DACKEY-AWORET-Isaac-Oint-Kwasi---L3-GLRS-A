import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastMessage } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  notificationService = inject(NotificationService);
  
  getIcon(type: string): string {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type as keyof typeof icons] || 'ℹ';
  }
  
  getClass(type: string): string {
    const classes = {
      success: 'toast-success',
      error: 'toast-error',
      warning: 'toast-warning',
      info: 'toast-info'
    };
    return classes[type as keyof typeof classes] || 'toast-info';
  }
}