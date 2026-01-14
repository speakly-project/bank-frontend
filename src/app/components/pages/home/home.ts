import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CAccountsList } from '../../ui/c-accounts-list/c-accounts-list';
import { CCardsList } from '../../ui/c-cards-list/c-cards-list';
import { BankDataService } from '../../../services/bank-data.service';
import { BankAccountInterface, BankCreditCardInterface } from '../../../models/BankInterfaces';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, CAccountsList, CCardsList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  private readonly bankData = inject(BankDataService);
  private subscriptions = new Subscription();

  accounts: BankAccountInterface[] = [];
  cards: BankCreditCardInterface[] = [];
  totalBalance = 0;

  ngOnInit() {
    this.subscriptions.add(
      this.bankData.getAccounts().subscribe(accounts => {
        this.accounts = accounts;
        this.totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
      })
    );

    this.subscriptions.add(
      this.bankData.getCards().subscribe(cards => {
        this.cards = cards;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
