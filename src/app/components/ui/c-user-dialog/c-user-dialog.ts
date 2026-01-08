import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserInterface } from '../../../models/UserInterface';
import { Boton } from "../c-boton/c-boton";
import { CUserCard } from '../c-user-card/c-user-card';
import { CUserForm } from '../c-user-form/c-user-form';

@Component({
  selector: 'c-user-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    Boton,
    CUserCard,
    CUserForm
  ],
  templateUrl: './c-user-dialog.html',
  styleUrl: './c-user-dialog.scss',
})
export class CUserDialog {
  importanciaBoton: 'primaria' | 'secundaria' | 'danger' | 'warning' = 'primaria';
  textoBoton!: string;
  titulo: string = '';

  constructor(
    public dialogRef: MatDialogRef<CUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserInterface, accion: 'modificar' | 'borrar' | 'nuevo' }
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
        this.textoBoton = 'Crear Usuario';
        break;
    }
  }

  get user(): UserInterface {
    return this.data.user;
  }

  ngOnInit() {
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  seleccionarAccion(accion: string): void {
    this.dialogRef.close(accion);
  }

  onGuardarUser(userActualizado: UserInterface): void {
    const accion = this.data.accion === 'nuevo' ? 'nuevo' : 'modificar';
    this.dialogRef.close({ accion, user: userActualizado });
  }
}
