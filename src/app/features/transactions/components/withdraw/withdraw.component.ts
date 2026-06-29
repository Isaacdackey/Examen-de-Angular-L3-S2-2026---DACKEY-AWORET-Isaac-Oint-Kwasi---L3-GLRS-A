import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionApiService } from '../../services/transaction-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { BalanceStore } from '../../../../core/services/balance-store.service';
import { phoneValidator } from '../../../../shared/validators/phone.validator';
import { amountValidator } from '../../../../shared/validators/amount.validator';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent {
  private fb = inject(FormBuilder);
  private transactionApi = inject(TransactionApiService);
  private notificationService = inject(NotificationService);
  private balanceStore = inject(BalanceStore);
  private router = inject(Router);

  isSubmitting = false;

  withdrawForm: FormGroup = this.fb.group({
    phoneNumber: ['', [Validators.required, phoneValidator()]],
    amount: [null, [Validators.required, amountValidator()]]
  });

  onSubmit(): void {
    if (this.withdrawForm.invalid) {
      this.withdrawForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.withdrawForm.value;

    this.transactionApi.withdraw(formData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Retrait effectué avec succès');
        this.balanceStore.refreshBalance();
        this.isSubmitting = false;
        this.router.navigate(['/admin/wallets']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.showError(error.error?.message || 'Erreur lors du retrait');
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.withdrawForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'Ce champ est requis';
    }
    if (errors['invalidPhone']) {
      return 'Numéro de téléphone invalide';
    }
    if (errors['amountPositive']) {
      return 'Le montant doit être positif';
    }
    if (errors['amountTooLarge']) {
      return 'Le montant est trop élevé';
    }
    return 'Champ invalide';
  }

  cancel(): void {
    this.router.navigate(['/admin/wallets']);
  }
}