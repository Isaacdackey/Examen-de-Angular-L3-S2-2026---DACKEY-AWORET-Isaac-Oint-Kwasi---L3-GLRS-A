import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingApiService } from '../../services/billing-api.service';
import { BalanceStore } from '../../../../core/services/balance-store.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { XofPipe } from '../../../../shared/pipes/xof.pipe';
import { amountValidator } from '../../../../shared/validators/amount.validator';

@Component({
  selector: 'app-bill-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, XofPipe],
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.css']
})
export class BillPaymentComponent {
  @Input() bill: any = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() paid = new EventEmitter<void>();

  private billingApi = inject(BillingApiService);
  private balanceStore = inject(BalanceStore);
  private notificationService = inject(NotificationService);

  isPaying = false;
  amount = 0;

  ngOnInit(): void {
    if (this.bill) {
      this.amount = this.bill.montant;
    }
  }

  ngOnChanges(): void {
    if (this.bill) {
      this.amount = this.bill.montant;
    }
  }

  payBill(): void {
    if (!this.bill) return;

    if (this.amount > this.balanceStore.balance()) {
      this.notificationService.showError('Solde insuffisant pour payer cette facture');
      return;
    }

    this.isPaying = true;

    this.billingApi.payBill({
      phoneNumber: this.balanceStore.getCurrentPhone(),
      serviceName: this.bill.serviceName,
      amount: this.amount
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Facture payée avec succès');
        this.balanceStore.refreshBalance();
        this.isPaying = false;
        this.paid.emit();
        this.close.emit();
      },
      error: (error) => {
        this.isPaying = false;
        this.notificationService.showError(
          error.error?.message || 'Erreur lors du paiement'
        );
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }
}