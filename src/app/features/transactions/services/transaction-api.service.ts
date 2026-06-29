import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TransactionResponse {
  id: number;
  type: string;
  amount: number;
  fees: number;
  description: string;
  targetPhone: string | null;
  createdAt: string;
}

export interface DepositRequest {
  amount: number;
  paymentMethod?: string;
}

export interface WithdrawRequest {
  phoneNumber: string;
  amount: number;
}

export interface TransferRequest {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionApiService {
  private baseUrl = `${environment.apiUrl}/api/wallets`;

  constructor(private http: HttpClient) {}

  deposit(walletId: number, request: DepositRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/${walletId}/deposit`, request);
  }

  withdraw(request: WithdrawRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, request);
  }

  transfer(request: TransferRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/transfer`, request);
  }

  getTransactions(phone: string): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/${phone}/transactions`);
  }

  payBill(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pay`, request);
  }

  payBills(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pay-factures`, request);
  }
}