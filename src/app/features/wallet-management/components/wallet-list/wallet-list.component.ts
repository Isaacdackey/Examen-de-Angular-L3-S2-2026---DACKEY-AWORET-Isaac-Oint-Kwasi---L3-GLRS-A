import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WalletApiService } from '../../services/wallet-api.service';
import { WalletResponse } from '../../../../core/models/wallet.model';
import { XofPipe } from '../../../../shared/pipes/xof.pipe';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { BalanceStore } from '../../../../core/services/balance-store.service';

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    XofPipe,
    PhoneFormatPipe,
    DateFormatPipe,
    TruncatePipe,
    PaginationComponent
  ],
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.css']
})
export class WalletListComponent implements OnInit {
  private walletApi = inject(WalletApiService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private balanceStore = inject(BalanceStore);

  wallets: WalletResponse[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadWallets();
  }

  loadWallets(): void {
    this.loading = true;
    this.walletApi.getWallets(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const data = response.data || response;
        this.wallets = data.content || [];
        this.totalItems = data.totalElements || 0;
        this.totalPages = data.totalPages || 0;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Erreur:', error);
        this.notificationService.showError('Erreur lors du chargement des portefeuilles');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadWallets();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadWallets();
  }

  
  searchWallet(phone: string): void {
    if (!phone || phone.trim().length < 5) {
      this.notificationService.showWarning('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    this.loading = true;
    this.walletApi.getWalletByPhone(phone.trim()).subscribe({
      next: (response) => {
        const wallet = response.data || response;
        if (wallet) {
          this.wallets = [wallet];
          this.totalItems = 1;
          this.totalPages = 1;
          this.notificationService.showSuccess('Portefeuille trouvé !');
        } else {
          this.wallets = [];
          this.totalItems = 0;
          this.totalPages = 0;
          this.notificationService.showInfo('Aucun portefeuille trouvé');
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.wallets = [];
        this.totalItems = 0;
        this.totalPages = 0;
        this.notificationService.showError('Erreur lors de la recherche');
      }
    });
  }

  viewWallet(id: number): void {
    this.router.navigate([`/admin/wallets/${id}`]);
  }


  openDeposit(id: number): void {
    this.router.navigate([`/admin/wallets/${id}/deposit`]);
  }

 
  openWithdraw(phone: string): void {
    this.router.navigate(['/admin/wallets/withdraw'], { 
      queryParams: { phone: phone } 
    });
  }

  
  deleteWallet(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce portefeuille ?')) {
      this.notificationService.showInfo('Fonctionnalité de suppression à implémenter');
      console.log('Supprimer le wallet ID:', id);
    }
  }
}