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

  formatNumber(num: string): string {
    const digits = (num ?? '').replace(/(.{4})/g, '$1 ').trim();
    const last4 = digits.length >= 4 ? digits.slice(-4) : digits;
    const first4 = digits.slice(0, 4);
    return `${first4} •••• •••• ${last4}`;
  }
}
