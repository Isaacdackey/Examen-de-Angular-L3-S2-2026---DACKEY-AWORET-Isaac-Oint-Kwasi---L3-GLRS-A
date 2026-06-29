import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingApiService } from '../../services/billing-api.service';
import { BalanceStore } from '../../../../core/services/balance-store.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { BillsListComponent, Bill } from '../bills-list/bills-list.component';
import { XofPipe } from '../../../../shared/pipes/xof.pipe';

@Component({
  selector: 'app-current-bills',
  standalone: true,
  imports: [CommonModule, FormsModule, BillsListComponent, XofPipe],
  templateUrl: './current-bills.component.html',
  styleUrls: ['./current-bills.component.css']
})
export class CurrentBillsComponent implements OnInit {
  private billingApi = inject(BillingApiService);
  public balanceStore = inject(BalanceStore);
  private notificationService = inject(NotificationService);

  bills: Bill[] = [];
  filteredBills: Bill[] = [];
  loading = true;
  walletCode = '';
  selectedService = 'ALL';
  isPaying = false;

  services = [
    { value: 'ALL', label: 'Tous les services' },
    { value: 'ISM', label: '📚 ISM' },
    { value: 'WOYAFAL', label: '📡 WOYAFAL' },
    { value: 'RAPIDO', label: '🚀 RAPIDO' }
  ];

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.loading = true;
    const phone = this.balanceStore.getCurrentPhone();

    this.billingApi.getCurrentMonthBills(phone).subscribe({
      next: (response) => {
        const data = response.data || [];
        this.bills = data.map((bill: any) => ({
          ...bill,
          selected: false
        }));
        this.applyFilter();
        this.loading = false;
        this.walletCode = this.bills[0]?.walletCode || '';
      },
      error: () => {
        this.loading = false;
        this.notificationService.showError('Erreur lors du chargement des factures');
      }
    });
  }

  applyFilter(): void {
    if (this.selectedService === 'ALL') {
      this.filteredBills = this.bills;
    } else {
      this.filteredBills = this.bills.filter(
        bill => bill.serviceName === this.selectedService
      );
    }
  }

  onServiceChange(): void {
    this.applyFilter();
  }

  paySelectedBills(selectedBills: Bill[]): void {
    if (selectedBills.length === 0) {
      this.notificationService.showWarning('Veuillez sélectionner au moins une facture');
      return;
    }

    const totalAmount = selectedBills.reduce((sum, bill) => sum + bill.montant, 0);
    
    if (totalAmount > this.balanceStore.balance()) {
      this.notificationService.showError('Solde insuffisant pour payer ces factures');
      return;
    }

    this.isPaying = true;
    const references = selectedBills.map(bill => bill.reference);
    const serviceName = selectedBills[0]?.serviceName || '';

    this.billingApi.payBills({
      phoneNumber: this.balanceStore.getCurrentPhone(),
      serviceName: serviceName,
      factureReferences: references
    }).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(
          `${selectedBills.length} facture(s) payée(s) avec succès`
        );
        this.balanceStore.refreshBalance();
        this.isPaying = false;
        this.loadBills();
      },
      error: (error) => {
        this.isPaying = false;
        this.notificationService.showError(
          error.error?.message || 'Erreur lors du paiement des factures'
        );
      }
    });
  }

  paySingleBill(bill: Bill): void {
    this.paySelectedBills([bill]);
  }

  viewBill(bill: Bill): void {
    this.notificationService.showInfo(
      `Facture ${bill.reference} - ${bill.serviceName}: ${new XofPipe().transform(bill.montant)}`
    );
  }


  getTotalUnpaid(): number {
    return this.bills.filter(b => !b.payee).reduce((sum, b) => sum + b.montant, 0);
  }

  refreshBills(): void {
    this.loadBills();
  }

  getUnpaidCount(): number {
  return this.bills.filter(b => !b.payee).length;
}

getPaidCount(): number {
  return this.bills.filter(b => b.payee).length;
}

getTotalAmount(): number {
  return this.bills.reduce((sum, b) => sum + b.montant, 0);
}

}