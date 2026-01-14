import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CAccountsList } from '../../ui/c-accounts-list/c-accounts-list';
import { CCardsList } from '../../ui/c-cards-list/c-cards-list';
import { BankDataClient } from '../../../services/bank-data-client';
import { BankAccountInterface, BankCreditCardInterface } from '../../../models/BankInterfaces';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, CAccountsList, CCardsList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  private readonly bankDataClient = inject(BankDataClient);
  private subscriptions = new Subscription();

  accounts: BankAccountInterface[] = [];
  cards: BankCreditCardInterface[] = [];
  totalBalance = 0;

  ngOnInit() {
    // TODO: Obtener el clientId del usuario autenticado
    const clientId = 4; // Temporal

    this.subscriptions.add(
      this.bankDataClient.getAccountsWithCardsByClientId(clientId).subscribe(accountsDetails => {
        this.accounts = accountsDetails.map(detail => ({
          id: detail.id,
          iban: detail.iban,
          balance: detail.balance,
          credit_cards: detail.cards.map(card => ({
            number: card.cardNumber,
            expiration_date: card.expirationDate,
            cvv: card.cvv,
            full_name: card.fullName,
          })),
        }));

        this.totalBalance = this.accounts.reduce((sum, a) => sum + a.balance, 0);
        this.cards = this.accounts.flatMap(a => a.credit_cards || []);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
