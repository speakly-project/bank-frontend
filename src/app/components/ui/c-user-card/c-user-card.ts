import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { UserInterface } from '../../../models/UserInterface';

@Component({
  selector: 'c-user-card',
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './c-user-card.html',
  styleUrl: './c-user-card.scss',
})
export class CUserCard {
  @Input() user!: UserInterface;
}
