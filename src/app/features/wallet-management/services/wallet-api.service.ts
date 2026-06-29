import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WalletResponse, WalletCreateRequest } from '../../../core/models/wallet.model';
import { TransactionResponse } from '../../../core/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class WalletApiService {
  private baseUrl = `${environment.apiUrl}/api/wallets`;

  constructor(private http: HttpClient) {}

  getWallets(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}&size=${size}`).pipe(
      map((response: any) => {
        if (response?.data?.data) {
          return {
            data: {
              content: response.data.data,
              totalElements: response.data.totalElements,
              totalPages: response.data.totalPages,
              number: response.data.currentPage,
              size: response.data.pageSize,
              first: response.data.isFirst,
              last: response.data.isLast
            }
          };
        }
        return response;
      })
    );
  }

  getWalletByPhone(phone: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${phone}`).pipe(
      map((response: any) => {
        if (response?.data) {
          return { data: response.data };
        }
        return response;
      })
    );
  }

  getBalance(phone: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${phone}/balance`).pipe(
      map((response: any) => {
        if (response?.data !== undefined) {
          return response.data;
        }
        return response;
      })
    );
  }

  createWallet(walletData: WalletCreateRequest): Observable<any> {
    return this.http.post(this.baseUrl, walletData);
  }

  deposit(walletId: number, amount: number, paymentMethod?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${walletId}/deposit`, { amount, paymentMethod });
  }

  withdraw(phone: string, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, { phoneNumber: phone, amount });
  }

  transfer(senderPhone: string, receiverPhone: string, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, { senderPhone, receiverPhone, amount });
  }

  getTransactions(phone: string): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/${phone}/transactions`).pipe(
      map((response: any) => {
        if (response?.data) {
          return response.data;
        }
        return response;
      })
    );
  }
}