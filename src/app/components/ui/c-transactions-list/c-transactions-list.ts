import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BankTransactionInterface } from '../../../models/BankInterfaces';

@Component({
  selector: 'c-transactions-list',
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

  private transactionSign(transaction: BankTransactionInterface): 1 | -1 | 0 {
    const type = this.normalizedType(transaction);

    if (type === 'credit' || type === 'add') return 1;
    if (type === 'debit' || type === 'subtract') return -1;
    return 0;
  }

  isDebit(transaction: BankTransactionInterface): boolean {
    return this.transactionSign(transaction) === -1;
  }

  isCredit(transaction: BankTransactionInterface): boolean {
    return this.transactionSign(transaction) === 1;
  }

  private signedAmount(transaction: BankTransactionInterface): number {
    const rawAmount = Number(transaction?.amount);
    const amount = Number.isFinite(rawAmount) ? Math.abs(rawAmount) : 0;

    return amount * this.transactionSign(transaction);
  }

  private ensureCumulativeDeltaCache(): void {
    if (this.cachedTransactionsRef === this.transactions) return;

    this.cachedTransactionsRef = this.transactions;

    let running = 0;
    this.cachedCumulativeDelta = this.transactions.map((transaction) => (running += this.signedAmount(transaction)));
  }

  amountPrefix(transaction: BankTransactionInterface): string {
    const sign = this.transactionSign(transaction);
    if (sign === 1) return '+ ';
    if (sign === -1) return '- ';
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
