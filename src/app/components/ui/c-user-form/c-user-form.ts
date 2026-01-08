import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInterface } from '../../../models/UserInterface';
import { Boton } from '../c-boton/c-boton';

@Component({
  selector: 'c-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Boton
  ],
  templateUrl: './c-user-form.html',
  styleUrl: './c-user-form.scss',
})
export class CUserForm {
  @Input() user!: UserInterface;
  @Input() modoEdicion: boolean = true;
  @Output() guardar = new EventEmitter<UserInterface>();
  @Output() cancelar = new EventEmitter<void>();

  formulario!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.crearFormulario();
  }

  crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      username: [this.user.username || '', [Validators.required, Validators.minLength(3)]],
      email: [this.user.email || '', [Validators.required, Validators.email]],
      profilePictureUrl: [this.user.profilePictureUrl || ''],
      role: [this.user.role || 'USER', Validators.required],
      password: [this.user.password || '', this.modoEdicion ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }

  onGuardar(): void {
    if (this.formulario.valid) {
      const userActualizado: UserInterface = {
        ...this.user,
        username: this.formulario.value.username,
        email: this.formulario.value.email,
        profilePictureUrl: this.formulario.value.profilePictureUrl,
        role: this.formulario.value.role,
        password: this.formulario.value.password
      };

      this.guardar.emit(userActualizado);
    }
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}
