import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { BankAccountInterface } from '../../../../models/BankInterfaces';
import { BankDataService } from '../../../../services/bank-data.service';
import { CTransactionsList } from '../../../ui/c-transactions-list/c-transactions-list';
import { CCardsList } from '../../../ui/c-cards-list/c-cards-list';

@Component({
  selector: 'app-account-detail',
  imports: [AsyncPipe, CurrencyPipe, CCardsList, CTransactionsList],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.scss',
})
export class AccountDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly bankData = inject(BankDataService);

  private normalizeIban(value: string): string {
    return (value ?? '').replace(/\s+/g, '').toUpperCase();
  }

  readonly iban$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('iban') ?? '')
  );

  readonly account$: Observable<BankAccountInterface | null> = combineLatest([
    this.iban$,
    this.bankData.getAccounts(),
  ]).pipe(
    map(([iban, accounts]) => {
      const target = this.normalizeIban(iban);
      return (
        accounts.find((a) => this.normalizeIban(a.iban) === target) ?? null
      );
    })
  );
}
