import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { XofPipe } from '../../../../shared/pipes/xof.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

export interface Bill {
  id: number;
  reference: string;
  walletCode: string;
  serviceName: string;
  montant: number;
  payee: boolean;
  dateFacture: string;
  datePaiement: string | null;
  selected?: boolean;
}

@Component({
  selector: 'app-bills-list',
  standalone: true,
  imports: [CommonModule, FormsModule, XofPipe, DateFormatPipe],
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.css']
})
export class BillsListComponent {
  @Input() bills: Bill[] = [];
  @Input() loading = false;
  @Input() showSelection = true;
  @Input() showActions = true;
  @Input() title = 'Factures';
  
  @Output() billSelect = new EventEmitter<Bill>();
  @Output() billPay = new EventEmitter<Bill>();
  @Output() billsPay = new EventEmitter<Bill[]>();
  @Output() viewBill = new EventEmitter<Bill>();

  selectAll = false;

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.bills.forEach(bill => {
      bill.selected = this.selectAll;
    });
  }

  toggleBill(bill: Bill): void {
    bill.selected = !bill.selected;
    this.billSelect.emit(bill);
    this.selectAll = this.bills.every(b => b.selected);
  }

  getSelectedBills(): Bill[] {
    return this.bills.filter(b => b.selected);
  }

  paySelectedBills(): void {
    const selected = this.getSelectedBills();
    if (selected.length > 0) {
      this.billsPay.emit(selected);
    }
  }

  getServiceIcon(service: string): string {
    const icons: Record<string, string> = {
      'ISM': '📚',
      'WOYAFAL': '📡',
      'RAPIDO': '🚀'
    };
    return icons[service] || '📄';
  }

  getTotalAmount(): number {
    return this.bills.reduce((sum, bill) => sum + bill.montant, 0);
  }

  getSelectedAmount(): number {
    return this.getSelectedBills().reduce((sum, bill) => sum + bill.montant, 0);
  }
}