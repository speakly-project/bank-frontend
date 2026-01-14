import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { combineLatest, map, shareReplay } from 'rxjs';
import { CAccountsList } from '../../ui/c-accounts-list/c-accounts-list';
import { CCardsList } from '../../ui/c-cards-list/c-cards-list';
import { BankDataService } from '../../../services/bank-data.service';
import { BankAccountInterface } from '../../../models/BankInterfaces';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, CurrencyPipe, CAccountsList, CCardsList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly bankData = inject(BankDataService);

  readonly accounts$ = this.bankData.getAccounts().pipe(shareReplay({ bufferSize: 1, refCount: true }));
  readonly cards$ = this.bankData.getCards().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly totalBalance$ = this.accounts$.pipe(
    map((accounts: BankAccountInterface[]) =>
      accounts.reduce((sum, a) => sum + (Number.isFinite(a.balance) ? a.balance : 0), 0)
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly vm$ = combineLatest({
    totalBalance: this.totalBalance$,
    accounts: this.accounts$,
    cards: this.cards$,
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
}
