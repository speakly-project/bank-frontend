import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CourseInterface } from '../../../models/CourseInterface';
import { Boton } from "../c-boton/c-boton";
import { CCursoCard } from '../c-curso-card/c-curso-card';
import { CCursoForm } from '../c-curso-form/c-curso-form';
@Component({
  selector: 'c-curso-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    Boton,
    CCursoCard,
    CCursoForm
],
  templateUrl: './c-curso-dialog.html',
  styleUrl: './c-curso-dialog.scss',
})
export class CCursoDialog {
  importanciaBoton: 'primaria' | 'secundaria' | 'danger' | 'warning' = 'primaria';
  textoBoton!: string;
  titulo: string = '';

  constructor(
    public dialogRef: MatDialogRef<CCursoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { curso: CourseInterface, accion: 'modificar' | 'borrar' | 'nuevo' }
  ){
    this.configurarDialog();
  }

  configurarDialog(): void {
    switch(this.data.accion) {
      case 'modificar':
        this.importanciaBoton = 'warning';
        this.textoBoton = 'Guardar Cambios';
        break;
      case 'borrar':
        this.importanciaBoton = 'danger';
        this.textoBoton = 'Confirmar Borrado';
        break;
      case 'nuevo':
        this.importanciaBoton = 'primaria';
        this.textoBoton = 'Crear Curso';
        break;
    }
  }

  get curso(): CourseInterface {
    return this.data.curso;
  }

  ngOnInit() {
  }
  cerrar(): void {
    this.dialogRef.close();
  }

  seleccionarAccion(accion: string): void {
    this.dialogRef.close(accion);
  }

  onGuardarCurso(cursoActualizado: CourseInterface): void {
    const accion = this.data.accion === 'nuevo' ? 'nuevo' : 'modificar';
    this.dialogRef.close({ accion, curso: cursoActualizado });
  }
}
