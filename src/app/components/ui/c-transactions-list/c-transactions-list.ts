import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BankTransactionInterface } from '../../../models/BankInterfaces';

@Component({
  selector: 'app-transactions-list',
  imports: [CurrencyPipe],
  templateUrl: './c-transactions-list.html',
  styleUrl: './c-transactions-list.scss',
})
export class CTransactionsList {
  @Input({ required: true }) transactions: BankTransactionInterface[] = [];
  @Input() title = 'Transacciones';
  @Input() balance = 0;

  private cachedTransactionsRef: BankTransactionInterface[] | null = null;
  private cachedCumulativeDelta: number[] = [];

  private normalizedType(transaction: BankTransactionInterface): string {
    return String(transaction?.transaction_type ?? '').trim().toLowerCase();
  }

  isDebit(transaction: BankTransactionInterface): boolean {
    const type = this.normalizedType(transaction);
    return type === 'debit' || type === 'subtract';
  }

  isCredit(transaction: BankTransactionInterface): boolean {
    const type = this.normalizedType(transaction);
    return type === 'credit' || type === 'add';
  }

  private signedAmount(transaction: BankTransactionInterface): number {
    const rawAmount = Number(transaction?.amount);
    const amount = Number.isFinite(rawAmount) ? Math.abs(rawAmount) : 0;

    if (this.isCredit(transaction)) return amount;
    if (this.isDebit(transaction)) return -amount;
    return 0;
  }

  private ensureCumulativeDeltaCache(): void {
    if (this.cachedTransactionsRef === this.transactions) return;

    this.cachedTransactionsRef = this.transactions;
    this.cachedCumulativeDelta = [];

    let running = 0;
    for (const tx of this.transactions) {
      running += this.signedAmount(tx);
      this.cachedCumulativeDelta.push(running);
    }
  }

  amountPrefix(transaction: BankTransactionInterface): string {
    if (this.isCredit(transaction)) {
      return '+ ';
    }

    if (this.isDebit(transaction)) {
      return '- ';
    }

    return '';
  }

  absoluteAmount(transaction: BankTransactionInterface): number {
    const value = Number(transaction?.amount);
    return Number.isFinite(value) ? Math.abs(value) : 0;
  }

  label(transaction: BankTransactionInterface): string {
    return transaction?.description || transaction?.transaction_type || 'Movimiento';
  }

  sublabel(transaction: BankTransactionInterface): string {
    const fecha = (transaction?.date ?? '').trim();
    const date = new Date(fecha);
    if (!fecha || Number.isNaN(date.getTime())) return fecha;

    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const dayMonthYear = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${time} - ${dayMonthYear}`;
  }

  amountBefore(transaction: BankTransactionInterface, index: number): number {
    this.ensureCumulativeDeltaCache();

    const currentBalance = Number(this.balance);
    if (!Number.isFinite(currentBalance)) return 0;

    const deltaUpToIndex = this.cachedCumulativeDelta[index] ?? 0;
    return currentBalance - deltaUpToIndex;
  }
}
