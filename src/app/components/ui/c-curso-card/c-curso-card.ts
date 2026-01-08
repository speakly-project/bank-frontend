import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CourseInterface } from '../../../models/CourseInterface';

@Component({
  selector: 'c-curso-card',
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './c-curso-card.html',
  styleUrl: './c-curso-card.scss',
})
export class CCursoCard {
  @Input() curso!: CourseInterface;
  imagenAleatoria: string;

  private imagenesDisponibles: string[] = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLPK9PCyWnpPHFqAyv4i2vGIq2gR5w2A5yuA&s',
    'https://offloadmedia.feverup.com/bilbaosecreto.com/wp-content/uploads/2020/04/07073643/idiomas-portada-1024x597.jpg',
    'https://img.freepik.com/vector-gratis/fondo-libro-ingles-dibujado-mano_23-2149483336.jpg?semt=ais_hybrid&w=740&q=80'
  ];

  constructor() {
    const indiceAleatorio = Math.floor(Math.random() * this.imagenesDisponibles.length);
    this.imagenAleatoria = this.imagenesDisponibles[indiceAleatorio];
  }

  get usuarioNombre(): string {
    return this.curso?.teacher?.username || '';
  }
}
