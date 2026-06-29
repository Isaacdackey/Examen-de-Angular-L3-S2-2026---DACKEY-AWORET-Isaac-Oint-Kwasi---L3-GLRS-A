import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  
  loginForm: FormGroup;
  isLoading = false;
  
  constructor() {
    this.loginForm = this.fb.group({
      phoneNumber: ['+221770000001', [Validators.required]],
      password: ['password123', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  onSubmit() {
    if (this.loginForm.invalid) return;
    
    this.isLoading = true;
    const { phoneNumber, password } = this.loginForm.value;
    
    this.authService.login({ phoneNumber, password }).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Connexion réussie !');
        this.isLoading = false;
        
        const user = this.authService.getCurrentUser();
        if (user?.role === 'AGENT' || user?.role === 'ADMIN') {
          this.router.navigate(['/admin/wallets']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  
  fillDemo(role: string) {
    if (role === 'CLIENT') {
      this.loginForm.patchValue({
        phoneNumber: '+221770000001',
        password: 'password123'
      });
    } else {
      this.loginForm.patchValue({
        phoneNumber: '+221770000002',
        password: 'password123'
      });
    }
  }
}
