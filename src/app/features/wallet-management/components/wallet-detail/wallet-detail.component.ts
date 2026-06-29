import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WalletApiService } from '../../services/wallet-api.service';
import { WalletResponse, TransactionResponse } from '../../../../core/models/wallet.model';
import { XofPipe } from '../../../../shared/pipes/xof.pipe';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-wallet-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, XofPipe, PhoneFormatPipe, DateFormatPipe],
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.css']
})
export class WalletDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private walletApi = inject(WalletApiService);
  private notificationService = inject(NotificationService);

  wallet: WalletResponse | null = null;
  transactions: TransactionResponse[] = [];
  loading = true;
  walletId: number = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.walletId = parseInt(id, 10);
      this.loadWalletDetails();
    }
  }

  loadWalletDetails(): void {
    this.loading = true;
    this.walletApi.getWallets(0, 1).subscribe({
      next: (response) => {
        const wallets = response.data?.data?.content || [];
        this.wallet = wallets.find((w: any) => w.id === this.walletId) || null;
        if (this.wallet) {
          this.loadTransactions(this.wallet.phoneNumber);
        } else {
          this.loading = false;
          this.notificationService.showError('Portefeuille non trouvé');
        }
      },
      error: () => {
        this.loading = false;
        this.notificationService.showError('Erreur lors du chargement');
      }
    });
  }

  loadTransactions(phone: string): void {
    this.walletApi.getTransactions(phone).subscribe({
      next: (transactions) => {
        this.transactions = transactions || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.showError('Erreur lors du chargement des transactions');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/wallets']);
  }
}