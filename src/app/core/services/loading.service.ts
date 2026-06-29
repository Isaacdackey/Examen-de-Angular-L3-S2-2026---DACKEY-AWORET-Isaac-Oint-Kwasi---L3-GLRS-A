import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = 0;
  private loadingSignal = signal<boolean>(false);
  private pendingRequests = signal<number>(0);
  
  public readonly isLoading = this.loadingSignal.asReadonly();
  public readonly requestsCount = this.pendingRequests.asReadonly();
  
  private loadingTextSignal = signal<string>('Chargement...');
  public readonly loadingText = this.loadingTextSignal.asReadonly();
  
  show(text?: string) {
    this.loadingCount++;
    this.pendingRequests.set(this.loadingCount);
    this.loadingSignal.set(true);
    
    if (text) {
      this.loadingTextSignal.set(text);
    }
  }
  
  hide() {
    if (this.loadingCount > 0) {
      this.loadingCount--;
      this.pendingRequests.set(this.loadingCount);
    }
    
    if (this.loadingCount === 0) {
      this.loadingSignal.set(false);
      this.loadingTextSignal.set('Chargement...');
    }
  }
  
  reset() {
    this.loadingCount = 0;
    this.pendingRequests.set(0);
    this.loadingSignal.set(false);
    this.loadingTextSignal.set('Chargement...');
  }
  
  setLoadingText(text: string) {
    this.loadingTextSignal.set(text);
  }
  
  isActive(): boolean {
    return this.loadingSignal();
  }
  
  async waitForCompletion(): Promise<void> {
    return new Promise((resolve) => {
      if (this.loadingCount === 0) {
        resolve();
        return;
      }
      
      const checkInterval = setInterval(() => {
        if (this.loadingCount === 0) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }
}