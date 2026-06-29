import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionApiService } from '../../services/transaction-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { BalanceStore } from '../../../../core/services/balance-store.service';
import { phoneValidator, differentPhoneValidator } from '../../../../shared/validators/custom-validators';
import { amountValidator } from '../../../../shared/validators/amount.validator';
import { XofPipe } from '../../../../shared/pipes/xof.pipe';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, XofPipe],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  private fb = inject(FormBuilder);
  private transactionApi = inject(TransactionApiService);
  private notificationService = inject(NotificationService);
  public balanceStore = inject(BalanceStore);
  private router = inject(Router);

  isSubmitting = false;

  transferForm: FormGroup = this.fb.group({
    senderPhone: ['+221770000001', [Validators.required, phoneValidator()]],
    receiverPhone: ['', [Validators.required, phoneValidator()]],
    amount: [null, [Validators.required, amountValidator()]]
  }, {
    validators: [differentPhoneValidator('senderPhone', 'receiverPhone')]
  });

  onSubmit(): void {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    const amount = this.transferForm.get('amount')?.value;
    if (amount > this.balanceStore.balance()) {
      this.notificationService.showError('Solde insuffisant pour effectuer ce transfert');
      this.transferForm.get('amount')?.setErrors({ insufficientFunds: true });
      return;
    }

    this.isSubmitting = true;
    const formData = this.transferForm.value;

    this.transactionApi.transfer(formData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Transfert effectué avec succès');
        this.balanceStore.refreshBalance();
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.showError(error.error?.message || 'Erreur lors du transfert');
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.transferForm.get(fieldName);
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
    if (errors['insufficientFunds']) {
      return 'Solde insuffisant';
    }
    return 'Champ invalide';
  }

  getFormError(): string {
    if (this.transferForm.errors?.['differentPhone']) {
      return 'L\'expéditeur et le destinataire doivent être différents';
    }
    return '';
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}