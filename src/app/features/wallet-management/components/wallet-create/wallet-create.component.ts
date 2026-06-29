import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { WalletApiService } from '../../services/wallet-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { phoneValidator } from '../../../../shared/validators/phone.validator';
import { amountValidator } from '../../../../shared/validators/amount.validator';

@Component({
  selector: 'app-wallet-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './wallet-create.component.html',
  styleUrls: ['./wallet-create.component.css']
})
export class WalletCreateComponent {
  private fb = inject(FormBuilder);
  private walletApi = inject(WalletApiService);
  private notificationService = inject(NotificationService);
  public router = inject(Router);
 
  isSubmitting = false;

  walletForm: FormGroup = this.fb.group({
    phoneNumber: ['', [Validators.required, phoneValidator()]],
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.minLength(3)]],
    initialBalance: [0, [Validators.required, amountValidator()]],
    currency: ['XOF']
  });

  onSubmit(): void {
    if (this.walletForm.invalid) {
      this.markFormGroupTouched(this.walletForm);
      return;
    }

    this.isSubmitting = true;
    const formData = this.walletForm.value;

    this.walletApi.createWallet(formData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Portefeuille créé avec succès');
        this.isSubmitting = false;
        this.router.navigate(['/admin/wallets']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.showError(error.error?.message || 'Erreur lors de la création');
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.walletForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'Ce champ est requis';
    }
    if (errors['email']) {
      return 'Email invalide';
    }
    if (errors['invalidPhone']) {
      return 'Numéro de téléphone invalide (format: +221 77 000 00 01)';
    }
    if (errors['minlength']) {
      return `Minimum ${errors['minlength'].requiredLength} caractères`;
    }
    if (errors['min']) {
      return `Minimum ${errors['min'].min}`;
    }
    if (errors['amountPositive']) {
      return 'Le montant doit être positif';
    }
    return 'Champ invalide';
  }
}