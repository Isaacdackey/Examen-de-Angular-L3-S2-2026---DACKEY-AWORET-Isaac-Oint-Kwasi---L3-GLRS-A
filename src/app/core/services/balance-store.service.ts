import { Injectable, signal } from '@angular/core';
import { WalletApiService } from '../../features/wallet-management/services/wallet-api.service';

@Injectable({ providedIn: 'root' })
export class BalanceStore {
  private balanceSignal = signal<number>(0);
  private currentPhoneSignal = signal<string>('+221770000001');
  private isLoadingSignal = signal<boolean>(false);
  
  public readonly balance = this.balanceSignal.asReadonly();
  public readonly currentPhone = this.currentPhoneSignal.asReadonly();
  public readonly isLoading = this.isLoadingSignal.asReadonly();
  
  constructor(private walletApi: WalletApiService) {
    setInterval(() => {
      this.refreshBalance();
    }, 30000);
  }
  
  refreshBalance(phone?: string) {
    const targetPhone = phone || this.currentPhoneSignal();
    this.isLoadingSignal.set(true);
    
    this.walletApi.getBalance(targetPhone).subscribe({
      next: (balance) => {
        this.balanceSignal.set(balance);
        this.isLoadingSignal.set(false);
      },
      error: (error) => {
        console.error('Erreur solde:', error);
        this.isLoadingSignal.set(false);
      }
    });
  }
  
  setCurrentPhone(phone: string) {
    if (this.currentPhoneSignal() !== phone) {
      this.currentPhoneSignal.set(phone);
      this.refreshBalance(phone);
    }
  }
  
  updateBalance(newBalance: number) {
    this.balanceSignal.set(newBalance);
  }
  
  addToBalance(amount: number) {
    this.balanceSignal.update(current => current + amount);
  }
  
  subtractFromBalance(amount: number) {
    this.balanceSignal.update(current => current - amount);
  }
  
  hasSufficientBalance(amount: number): boolean {
    return this.balanceSignal() >= amount;
  }
  
  getCurrentPhone(): string {
    return this.currentPhoneSignal();
  }
}