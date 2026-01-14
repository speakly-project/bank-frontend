import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BankAccountInterface } from '../../../../models/BankInterfaces';
import { BankDataClient } from '../../../../services/bank-data-client';
import { CTransactionsList } from '../../../ui/c-transactions-list/c-transactions-list';
import { CCardsList } from '../../../ui/c-cards-list/c-cards-list';

@Component({
  selector: 'app-account-detail',
  imports: [CurrencyPipe, CCardsList, CTransactionsList],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.scss',
})
export class AccountDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly bankDataClient = inject(BankDataClient);
  private subscriptions = new Subscription();

  account: BankAccountInterface | null = null;

  ngOnInit() {
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const iban = params.get('iban');
        if (iban) {
          this.bankDataClient.getAccountDetailsByIban(iban).subscribe(detail => {

            this.account = {
              iban: detail.iban,
              balance: detail.balance,
              credit_cards: detail.cards.map(card => ({
                number: card.cardNumber,
                expiration_date: card.expirationDate,
                cvv: card.cvv,
                full_name: card.fullName,
              })),
              transactions: detail.transactions.map(transaction => ({
                transaction_type: transaction.type,
                transaction_origin: transaction.origin,
                credit_card: transaction.originCardNumber || undefined,
                date: transaction.transactionDate,
                amount: transaction.amount,
                description: transaction.description,
              })),
            };
          });
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
