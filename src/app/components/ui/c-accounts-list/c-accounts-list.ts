import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BankAccountInterface } from '../../../models/BankInterfaces';

@Component({
  selector: 'c-accounts-list',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './c-accounts-list.html',
  styleUrl: './c-accounts-list.scss',
})
export class CAccountsList {
  @Input({ required: true }) accounts: BankAccountInterface[] = [];
  @Input() title = 'Mis cuentas';

  totalBalance(): number {
    return this.accounts.reduce(
      (sum, a) => sum + (Number.isFinite(a.balance) ? a.balance : 0),
      0
    );
  }

  accountLabel(account: BankAccountInterface): string {
    const iban = account?.iban ?? '';
    const last4 = iban.length >= 4 ? iban.slice(-4) : iban;
    return `Cuenta •••• ${last4}`;
  }
}
