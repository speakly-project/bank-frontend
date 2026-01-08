import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Boton } from "../c-boton/c-boton";
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Boton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
})

export class Header {
  constructor(public authService: AuthService) {}
}
