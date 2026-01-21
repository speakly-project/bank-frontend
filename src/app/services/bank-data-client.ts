
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountDetailsResponse, AccountSummaryResponse, BankTransactionResponse, CardPaymentRequest, CardPaymentResponse } from '../models/BankInterfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BankDataClient {
  private readonly baseUrl = environment.apiUrl + 'api/speakly-bank';
  private readonly http = inject(HttpClient);

  /**
   * GET /api/speakly-bank/accounts?clientId={clientId}
   * Lista todas las cuentas de un cliente
   */
  getAccountsByClientId(clientId: number): Observable<AccountSummaryResponse[]> {
    const params = new HttpParams().set('clientId', clientId.toString());
    return this.http.get<AccountSummaryResponse[]>(`${this.baseUrl}/accounts`, { params });
  }

  /**
   * GET /api/speakly-bank/accounts/{iban}
   * Devuelve el detalle completo de una cuenta por IBAN: balance + tarjetas + transacciones
   */
  getAccountDetailsByIban(iban: string): Observable<AccountDetailsResponse> {
    return this.http.get<AccountDetailsResponse>(`${this.baseUrl}/accounts/${iban}`);
  }

  /**
   * GET /api/speakly-bank/accounts/detailed?clientId={clientId}
   * Devuelve todas las cuentas de un cliente con tarjetas incluidas
   */
  getAccountsWithCardsByClientId(clientId: number): Observable<AccountDetailsResponse[]> {
    const params = new HttpParams().set('clientId', clientId.toString());
    return this.http.get<AccountDetailsResponse[]>(`${this.baseUrl}/accounts/detailed`, { params });
  }

  // ============= Transaction Endpoints =============

  /**
   * GET /api/speakly-bank/transactions?bankAccountId={bankAccountId}
   * Obtiene todas las transacciones de una cuenta bancaria
   */
  getTransactionsByBankAccountId(bankAccountId: number): Observable<BankTransactionResponse[]> {
    const params = new HttpParams().set('bankAccountId', bankAccountId.toString());
    return this.http.get<BankTransactionResponse[]>(`${this.baseUrl}/transactions`, { params });
  }

  // ============= Payment Endpoints =============

  /**
   * POST /api/speakly-bank/payments
   * Procesa un pago con tarjeta
   */
  processCardPayment(request: CardPaymentRequest): Observable<CardPaymentResponse> {
    return this.http.post<CardPaymentResponse>(`${this.baseUrl}/payments`, request);
  }
}
