import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'c-table',
  standalone: true,
  templateUrl: './c-table.html',
  styleUrl: './c-table.scss',
})
export class CTable {
  @Input() title = '';
  @Input() showFilters = true;
  @Input() showActions = true;
  @Input() isEmpty = false;
}
