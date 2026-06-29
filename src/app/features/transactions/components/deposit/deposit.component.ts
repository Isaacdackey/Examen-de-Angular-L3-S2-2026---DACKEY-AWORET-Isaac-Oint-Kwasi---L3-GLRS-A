import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionApiService } from '../../services/transaction-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { BalanceStore } from '../../../../core/services/balance-store.service';
import { amountValidator } from '../../../../shared/validators/amount.validator';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {
  private fb = inject(FormBuilder);
  private transactionApi = inject(TransactionApiService);
  private notificationService = inject(NotificationService);
  private balanceStore = inject(BalanceStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isSubmitting = false;
  walletId: number = 0;

  depositForm: FormGroup = this.fb.group({
    amount: [null, [Validators.required, amountValidator()]],
    paymentMethod: ['CASH']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.walletId = parseInt(id, 10);
    }
  }

  onSubmit(): void {
    if (this.depositForm.invalid) {
      this.depositForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.depositForm.value;

    this.transactionApi.deposit(this.walletId, formData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Dépot effectué avec succès');
        this.balanceStore.refreshBalance();
        this.isSubmitting = false;
        this.router.navigate(['/admin/wallets']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.showError(error.error?.message || 'Erreur lors du dépot');
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.depositForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'Ce champ est requis';
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