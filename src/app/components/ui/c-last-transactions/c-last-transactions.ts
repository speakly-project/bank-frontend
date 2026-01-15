import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subscription, switchMap } from 'rxjs';
import { BankDataClient } from '../../../services/bank-data-client';
import { AuthClient } from '../../../services/auth-client';
import { BankTransactionResponse } from '../../../models/BankInterfaces';

@Component({
  selector: 'c-last-transactions',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './c-last-transactions.html',
  styleUrl: './c-last-transactions.scss',
})
export class CLastTransactions implements OnInit, OnDestroy {
  private readonly bankDataClient = inject(BankDataClient);
  private readonly authClient = inject(AuthClient);
  private subscriptions = new Subscription();

  allTransactions: BankTransactionResponse[] = [];
  transactions: BankTransactionResponse[] = [];
  loading = true;
  error: string | null = null;
  itemsPerPage = 5;
  visibleCount = 5;

  ngOnInit() {
    this.subscriptions.add(
      this.authClient.getCurrentUserFromToken()
        .pipe(
          switchMap(user => this.bankDataClient.getAccountsWithCardsByClientId(Number(user.id)))
        )
        .subscribe({
          next: (accountsDetails) => {
            // todas las transacciones de todas las cuentas y ordenar por fecha
            this.allTransactions = accountsDetails.flatMap(account => account.transactions || [])
              .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
            // Mostrar inicialmente las primeras 5
            this.updateVisibleTransactions();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al obtener transacciones:', err);
            this.error = 'Error al cargar las transacciones';
            this.loading = false;
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  private normalizedType(transaction: BankTransactionResponse): string {
    return String(transaction?.type ?? '').trim().toLowerCase();
  }

  isDebit(transaction: BankTransactionResponse): boolean {
    const type = this.normalizedType(transaction);
    return type === 'debit' || type === 'subtract';
  }

  isCredit(transaction: BankTransactionResponse): boolean {
    const type = this.normalizedType(transaction);
    return type === 'credit' || type === 'add';
  }

  getAmountPrefix(transaction: BankTransactionResponse): string {
    if (this.isCredit(transaction)) {
      return '+ ';
    }
    if (this.isDebit(transaction)) {
      return '- ';
    }
    return '';
  }
  formatDate(date: string): string {
    const dateObj = new Date(date);
    if (Number.isNaN(dateObj.getTime())) return date;

    const time = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const dayMonthYear = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${time} - ${dayMonthYear}`;
  }

  loadMore(): void {
    this.visibleCount = Math.min(this.visibleCount + this.itemsPerPage, this.allTransactions.length);
    this.updateVisibleTransactions();
  }

  viewAll(): void {
    this.visibleCount = this.allTransactions.length;
    this.updateVisibleTransactions();
  }

  private updateVisibleTransactions(): void {
    this.transactions = this.allTransactions.slice(0, this.visibleCount);
  }

  hasMoreTransactions(): boolean {
    return this.visibleCount < this.allTransactions.length;
  }
}
