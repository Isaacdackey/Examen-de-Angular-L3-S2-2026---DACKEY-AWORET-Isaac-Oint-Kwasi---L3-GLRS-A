import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BalanceStore } from '../../core/services/balance-store.service';
import { WalletApiService } from '../wallet-management/services/wallet-api.service';
import { TransactionResponse } from '../../core/models/transaction.model';
import { BillingApiService } from '../billing/services/billing-api.service';
import { XofPipe } from '../../shared/pipes/xof.pipe';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { PhoneFormatPipe } from '../../shared/pipes/phone-format.pipe';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, XofPipe, DateFormatPipe, PhoneFormatPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public balanceStore = inject(BalanceStore);
  private walletApi = inject(WalletApiService);
  private billingApi = inject(BillingApiService);
  private notificationService = inject(NotificationService);

  recentTransactions: TransactionResponse[] = [];
  pendingBills: any[] = [];
  isLoading = signal(true);
  isLoadingBills = signal(true);
  currentPhone = this.balanceStore.getCurrentPhone();
  walletCode = '';

  stats = computed(() => {
    const totalDeposits = this.recentTransactions
      .filter(tx => tx.type === 'DEPOT' || tx.type === 'TRANSFERT_RECEPTION')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalWithdrawals = this.recentTransactions
      .filter(tx => tx.type === 'RETRAIT' || tx.type === 'TRANSFERT_ENVOI' || tx.type === 'PAIEMENT_FACTURE')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalDeposits,
      totalWithdrawals,
      transactionCount: this.recentTransactions.length,
      pendingBills: this.pendingBills.length,
      pendingBillsAmount: this.pendingBills.reduce((sum, bill) => sum + bill.montant, 0)
    };
  });

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    this.isLoadingBills.set(true);

    const phone = this.balanceStore.getCurrentPhone();
    this.currentPhone = phone;

    this.walletApi.getWalletByPhone(phone).subscribe({
      next: (response) => {
        const wallet = response.data || response;
        if (wallet?.code) {
          this.walletCode = wallet.code;
          this.loadBills(wallet.code);
        }
        this.isLoadingBills.set(false);
      },
      error: () => {
        this.isLoadingBills.set(false);
        this.notificationService.showWarning('Impossible de charger les factures');
      }
    });

    this.walletApi.getTransactions(phone).subscribe({
      next: (transactions) => {
        this.recentTransactions = (transactions || []).slice(0, 5);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showError('Erreur lors du chargement des transactions');
      }
    });
  }

  loadBills(walletCode: string) {
    this.billingApi.getCurrentMonthBills(walletCode).subscribe({
      next: (response) => {
        const bills = response.data || [];
        this.pendingBills = bills.filter((b: any) => !b.payee);
        this.isLoadingBills.set(false);
      },
      error: () => {
        this.isLoadingBills.set(false);
        this.notificationService.showWarning('Impossible de charger les factures');
      }
    });
  }

  refreshBalance() {
    this.balanceStore.refreshBalance();
    this.loadDashboardData();
  }

  getTransactionIcon(type: string): string {
    const icons: Record<string, string> = {
      'DEPOT': 'fas fa-arrow-down',
      'RETRAIT': 'fas fa-arrow-up',
      'TRANSFERT_ENVOI': 'fas fa-paper-plane',
      'TRANSFERT_RECEPTION': 'fas fa-inbox',
      'PAIEMENT_FACTURE': 'fas fa-file-invoice-dollar'
    };
    return icons[type] || 'fas fa-circle';
  }

  isCredit(tx: TransactionResponse): boolean {
    return tx.type === 'DEPOT' || tx.type === 'TRANSFERT_RECEPTION';
  }

  isDebit(tx: TransactionResponse): boolean {
    return tx.type === 'RETRAIT' || tx.type === 'TRANSFERT_ENVOI' || tx.type === 'PAIEMENT_FACTURE';
  }

  getServiceIcon(service: string): string {
    const icons: Record<string, string> = {
      'ISM': 'fas fa-graduation-cap',
      'WOYAFAL': 'fas fa-wifi',
      'RAPIDO': 'fas fa-tachometer-alt'
    };
    return icons[service] || 'fas fa-file-invoice';
  }
}