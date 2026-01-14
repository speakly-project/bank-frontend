import { Component, Input } from '@angular/core';

@Component({
  selector: 'c-bank-card',
  templateUrl: './c-bank-card.html',
  styleUrls: ['./c-bank-card.scss']
})
export class CBankCardComponent {

  @Input() number?: string;
  @Input() holder?: string;
  @Input() expiry?: string;
  @Input() revealNumber = false;
  @Input() cvv?: string;
  @Input() revealCvv = false;
  @Input() flipped?: boolean;
  @Input() flipOnClick = true;

  private internalFlipped = false;

  get isFlipped(): boolean {
    return this.flipped ?? this.internalFlipped;
  }

  toggleFlip(): void {
    if (!this.flipOnClick) return;
    if (this.flipped !== undefined) return;
    this.internalFlipped = !this.internalFlipped;
  }

  displayedNumber(): string {
    return this.revealNumber ? this.formatFullNumber(this.number ?? '') : this.formatNumber(this.number ?? '');
  }

  displayedCvv(): string {
    if (!this.cvv) {
      return '---';
    }

    return this.revealCvv ? this.cvv : '•••';
  }

  private formatFullNumber(num: string): string {
    return (num ?? '')
      .replace(/\D+/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  formatNumber(num: string): string {
    const digits = (num ?? '').replace(/(.{4})/g, '$1 ').trim();
    const last4 = digits.length >= 4 ? digits.slice(-4) : digits;
    const first4 = digits.slice(0, 4);
    return `${first4} •••• •••• ${last4}`;
  }
}
