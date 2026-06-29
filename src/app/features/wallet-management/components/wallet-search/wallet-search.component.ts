import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WalletApiService } from '../../services/wallet-api.service';
import { WalletResponse } from '../../../../core/models/wallet.model';
import { XofPipe } from '../../../../shared/pipes/xof.pipe';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-wallet-search',
  standalone: true,
  imports: [CommonModule, FormsModule, XofPipe, PhoneFormatPipe, DateFormatPipe],
  templateUrl: './wallet-search.component.html',
  styleUrls: ['./wallet-search.component.css']
})
export class WalletSearchComponent {
  private walletApi = inject(WalletApiService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  searchPhone = '';
  wallet: WalletResponse | null = null;
  loading = false;
  searched = false;

  searchWallet(): void {
    if (!this.searchPhone || this.searchPhone.trim().length < 5) {
      this.notificationService.showWarning('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    this.loading = true;
    this.wallet = null;
    this.searched = true;

    this.walletApi.getWalletByPhone(this.searchPhone.trim()).subscribe({
      next: (response) => {
        this.wallet = response.data || null;
        this.loading = false;
        if (!this.wallet) {
          this.notificationService.showInfo('Aucun portefeuille trouvé pour ce numéro');
        }
      },
      error: () => {
        this.loading = false;
        this.wallet = null;
        this.notificationService.showError('Erreur lors de la recherche');
      }
    });
  }

  clearSearch(): void {
    this.searchPhone = '';
    this.wallet = null;
    this.searched = false;
  }

  openDeposit(id: number): void {
    this.router.navigate([`/admin/wallets/${id}/deposit`]);
  }

  openWithdraw(phone: string): void {
    this.router.navigate(['/admin/wallets/withdraw'], { 
      queryParams: { phone: phone } 
    });
  }

  viewTransactions(phone: string): void {
  
    this.router.navigate(['/transactions'], { 
      queryParams: { phone: phone } 
    });
  }
}