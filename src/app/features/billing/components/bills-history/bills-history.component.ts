import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingApiService } from '../../services/billing-api.service';
import { BalanceStore } from '../../../../core/services/balance-store.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { BillsListComponent, Bill } from '../bills-list/bills-list.component';
import { XofPipe } from '../../../../shared/pipes/xof.pipe';

@Component({
  selector: 'app-bills-history',
  standalone: true,
  imports: [CommonModule, FormsModule, BillsListComponent, XofPipe],
  templateUrl: './bills-history.component.html',
  styleUrls: ['./bills-history.component.css']
})
export class BillsHistoryComponent implements OnInit {
  private billingApi = inject(BillingApiService);
  private balanceStore = inject(BalanceStore);
  private notificationService = inject(NotificationService);

  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  loading = true;
  walletCode = '';
  
  startDate = '';
  endDate = '';
  selectedService = 'ALL';

  services = [
    { value: 'ALL', label: 'Tous les services' },
    { value: 'ISM', label: '📚 ISM' },
    { value: 'WOYAFAL', label: '📡 WOYAFAL' },
    { value: 'RAPIDO', label: '🚀 RAPIDO' }
  ];

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    const phone = this.balanceStore.getCurrentPhone();

    this.billingApi.getCurrentMonthBills(phone).subscribe({
      next: (response) => {
        const data = response.data || [];
        this.bills = data.map((bill: any) => ({
          ...bill,
          selected: false
        }));
        this.applyFilters();
        this.loading = false;
        this.walletCode = this.bills[0]?.walletCode || '';
      },
      error: () => {
        this.loading = false;
        this.notificationService.showError('Erreur lors du chargement de l\'historique');
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.bills];

    if (this.selectedService !== 'ALL') {
      filtered = filtered.filter(
        bill => bill.serviceName === this.selectedService
      );
    }

    
    if (this.startDate) {
      const start = new Date(this.startDate);
      filtered = filtered.filter(
        bill => new Date(bill.dateFacture) >= start
      );
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59);
      filtered = filtered.filter(
        bill => new Date(bill.dateFacture) <= end
      );
    }

    this.filteredBills = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.selectedService = 'ALL';
    this.applyFilters();
  }

  viewBill(bill: Bill): void {
    this.notificationService.showInfo(
      `Facture ${bill.reference} - ${bill.serviceName}: ${new XofPipe().transform(bill.montant)}`
    );
  }

  getPaidCount(): number {
    return this.bills.filter(b => b.payee).length;
  }

  getUnpaidCount(): number {
    return this.bills.filter(b => !b.payee).length;
  }

  getTotalPaid(): number {
    return this.bills.filter(b => b.payee).reduce((sum, b) => sum + b.montant, 0);
  }

  getTotalUnpaid(): number {
    return this.bills.filter(b => !b.payee).reduce((sum, b) => sum + b.montant, 0);
  }

  refreshHistory(): void {
    this.loadHistory();
  }
  
}