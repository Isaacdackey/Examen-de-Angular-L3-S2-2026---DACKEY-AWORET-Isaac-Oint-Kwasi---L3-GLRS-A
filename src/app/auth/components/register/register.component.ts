import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { phoneValidator } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  
  registerForm: FormGroup;
  isLoading = false;
  
  constructor() {
    this.registerForm = this.fb.group({
      phoneNumber: ['', [Validators.required, phoneValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['CLIENT', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
  
  onSubmit() {
    if (this.registerForm.invalid) return;
    
    this.isLoading = true;
    const { phoneNumber, email, password, role } = this.registerForm.value;
    
    this.authService.register({ phoneNumber, email, password, role }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Inscription réussie !');
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
}