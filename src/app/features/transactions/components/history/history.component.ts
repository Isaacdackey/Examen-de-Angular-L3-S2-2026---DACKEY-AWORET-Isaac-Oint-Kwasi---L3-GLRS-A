import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionApiService, TransactionResponse } from '../../services/transaction-api.service';
import { BalanceStore } from '../../../../core/services/balance-store.service';
import { XofPipe } from '../../../../shared/pipes/xof.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, XofPipe, DateFormatPipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  private transactionApi = inject(TransactionApiService);
  private balanceStore = inject(BalanceStore);
  private notificationService = inject(NotificationService);

  transactions: TransactionResponse[] = [];
  filteredTransactions: TransactionResponse[] = [];
  loading = true;
  
  filterType = 'ALL';
  searchTerm = '';
  startDate = '';
  endDate = '';

  transactionTypes = [
    { value: 'ALL', label: 'Tous' },
    { value: 'DEPOT', label: 'Dépôts' },
    { value: 'RETRAIT', label: 'Retraits' },
    { value: 'TRANSFERT_ENVOI', label: 'Transferts envoyés' },
    { value: 'TRANSFERT_RECEPTION', label: 'Transferts reçus' },
    { value: 'PAIEMENT_FACTURE', label: 'Paiements' }
  ];

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    const phone = this.balanceStore.getCurrentPhone();
    
    this.transactionApi.getTransactions(phone).subscribe({
      next: (transactions) => {
        this.transactions = transactions || [];
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.showError('Erreur lors du chargement des transactions');
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.transactions];

    // Filter by type
    if (this.filterType !== 'ALL') {
      filtered = filtered.filter(tx => tx.type === this.filterType);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.description?.toLowerCase().includes(term) ||
        tx.targetPhone?.toLowerCase().includes(term)
      );
    }

    // Filter by date range
    if (this.startDate) {
      const start = new Date(this.startDate);
      filtered = filtered.filter(tx => new Date(tx.createdAt) >= start);
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59);
      filtered = filtered.filter(tx => new Date(tx.createdAt) <= end);
    }

    this.filteredTransactions = filtered;
  }

  resetFilters(): void {
    this.filterType = 'ALL';
    this.searchTerm = '';
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  getTransactionIcon(type: string): string {
    const icons: Record<string, string> = {
      'DEPOT': '💰',
      'RETRAIT': '🏧',
      'TRANSFERT_ENVOI': '✈️',
      'TRANSFERT_RECEPTION': '📥',
      'PAIEMENT_FACTURE': '📄'
    };
    return icons[type] || '📋';
  }

  getTransactionLabel(type: string): string {
    const labels: Record<string, string> = {
      'DEPOT': 'Dépôt',
      'RETRAIT': 'Retrait',
      'TRANSFERT_ENVOI': 'Transfert envoyé',
      'TRANSFERT_RECEPTION': 'Transfert reçu',
      'PAIEMENT_FACTURE': 'Paiement facture'
    };
    return labels[type] || type;
  }

  getTransactionClass(type: string): string {
    const credit = ['DEPOT', 'TRANSFERT_RECEPTION'];
    return credit.includes(type) ? 'credit' : 'debit';
  }

  getTotalDeposits(): number {
    return this.transactions
      .filter(tx => tx.type === 'DEPOT' || tx.type === 'TRANSFERT_RECEPTION')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  getTotalWithdrawals(): number {
    return this.transactions
      .filter(tx => tx.type === 'RETRAIT' || tx.type === 'TRANSFERT_ENVOI' || tx.type === 'PAIEMENT_FACTURE')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }
}