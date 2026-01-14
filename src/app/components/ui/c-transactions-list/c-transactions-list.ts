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
    const origin = transaction?.transaction_origin ? `• ${transaction.transaction_origin}` : '';
    return `${transaction?.date ?? ''} ${origin}`.trim();
  }
}
