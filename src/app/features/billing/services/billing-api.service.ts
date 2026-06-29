import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FactureResponse, PayFacturesRequest } from '../models/facture-request.model';

@Injectable({
  providedIn: 'root'
})
export class BillingApiService {
  private baseUrl = `${environment.apiUrl}/api/external/factures`;
  private walletBaseUrl = `${environment.apiUrl}/api/wallets`;

  constructor(private http: HttpClient) {}

  getCurrentMonthBills(walletCode: string, service?: string): Observable<any> {
    let url = `${this.baseUrl}/${walletCode}/current`;
    if (service) {
      url += `?unite=${service}`;
    }
    return this.http.get(url);
  }

  getBillsByPeriod(walletCode: string, startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${walletCode}/periode?debut=${startDate}&fin=${endDate}`);
  }

  payBills(request: PayFacturesRequest): Observable<any> {
    return this.http.post(`${this.walletBaseUrl}/pay-factures`, request);
  }

  payBill(request: any): Observable<any> {
    return this.http.post(`${this.walletBaseUrl}/pay`, request);
  }
}