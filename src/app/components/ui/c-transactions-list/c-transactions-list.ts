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

  private normalizedType(tx: BankTransactionInterface): string {
    return String(tx?.transaction_type ?? '').trim().toLowerCase();
  }

  isDebit(tx: BankTransactionInterface): boolean {
    return this.normalizedType(tx) === 'debit';
  }

  isCredit(tx: BankTransactionInterface): boolean {
    return this.normalizedType(tx) === 'credit';
  }

  amountPrefix(tx: BankTransactionInterface): string {
    if (this.isCredit(tx)) {
      return '+ ';
    }

    if (this.isDebit(tx)) {
      return '- ';
    }

    return '';
  }

  absoluteAmount(tx: BankTransactionInterface): number {
    const value = Number(tx?.amount);
    return Number.isFinite(value) ? Math.abs(value) : 0;
  }

  label(tx: BankTransactionInterface): string {
    return tx?.description || tx?.transaction_type || 'Movimiento';
  }

  sublabel(tx: BankTransactionInterface): string {
    const origin = tx?.transaction_origin ? `• ${tx.transaction_origin}` : '';
    return `${tx?.date ?? ''} ${origin}`.trim();
  }
}
