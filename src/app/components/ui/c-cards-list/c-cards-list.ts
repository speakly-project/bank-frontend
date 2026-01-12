import { Component, Input } from '@angular/core';
import { BankCreditCardInterface } from '../../../models/BankInterfaces';
import { CBankCardComponent } from "../c-bank-card/c-bank-card";

@Component({
  selector: 'app-cards-list',
  imports: [CBankCardComponent],
  templateUrl: './c-cards-list.html',
  styleUrl: './c-cards-list.scss',
})
export class CCardsList {
  @Input({ required: true }) cards: BankCreditCardInterface[] = [];
  @Input() title = 'Mis tarjetas';

  expandedCardNumber: string | null = null;
  private readonly cvvVisibleByCard = new Set<string>();
  private readonly numberVisibleByCard = new Set<string>();

  totalCards(): number {
    return this.cards.length;
  }

  activeCards(): number {
    return this.cards.length;
  }

  maskCardNumber(cardNumber: string): string {
    const digits = (cardNumber ?? '').replace(/\s+/g, '');
    const last4 = digits.length >= 4 ? digits.slice(-4) : digits;
    return `•••• ${last4}`;
  }

  maskedCardNumber(cardNumber: string): string {
    const digits = (cardNumber ?? '').replace(/\s+/g, '');
    if (digits.length <= 8) {
      return digits;
    }

    const first4 = digits.slice(0, 4);
    const last4 = digits.slice(-4);
    return `${first4} **** **** ${last4}`;
  }

  private formatGroupsOf4(digits: string): string {
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  toggleExpanded(cardNumber: string): void {
    const isClosingSameCard = this.expandedCardNumber === cardNumber;

    if (this.expandedCardNumber) {
      this.cvvVisibleByCard.delete(this.expandedCardNumber);
      this.numberVisibleByCard.delete(this.expandedCardNumber);
    }

    if (isClosingSameCard) {
      this.expandedCardNumber = null;
      return;
    }

    this.cvvVisibleByCard.delete(cardNumber);
    this.numberVisibleByCard.delete(cardNumber);
    this.expandedCardNumber = cardNumber;
  }

  isExpanded(cardNumber: string): boolean {
    return this.expandedCardNumber === cardNumber;
  }

  isCvvVisible(cardNumber: string): boolean {
    return this.cvvVisibleByCard.has(cardNumber);
  }

  toggleCvv(card: BankCreditCardInterface, event: MouseEvent): void {
    event.stopPropagation();

    const cardNumber = card.number;
    if (!cardNumber) {
      return;
    }

    if (this.cvvVisibleByCard.has(cardNumber)) {
      this.cvvVisibleByCard.delete(cardNumber);
    } else {
      this.cvvVisibleByCard.add(cardNumber);
    }
  }

  displayedCvv(card: BankCreditCardInterface): string {
    return this.isCvvVisible(card.number) ? card.cvv : '***';
  }

  isNumberVisible(cardNumber: string): boolean {
    return this.numberVisibleByCard.has(cardNumber);
  }

  toggleNumber(card: BankCreditCardInterface, event: MouseEvent): void {
    event.stopPropagation();

    const cardNumber = card.number;
    if (this.numberVisibleByCard.has(cardNumber)) {
      this.numberVisibleByCard.delete(cardNumber);
    } else {
      this.numberVisibleByCard.add(cardNumber);
    }
  }

  displayedCardNumber(card: BankCreditCardInterface): string {
    const digits = (card?.number ?? '').replace(/\s+/g, '');
    if (!digits) {
      return '';
    }

    return this.isNumberVisible(card.number) ? this.formatGroupsOf4(digits) : this.maskedCardNumber(digits);
  }
}
