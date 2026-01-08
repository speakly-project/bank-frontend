import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseInterface } from '../../../models/CourseInterface';
import { Boton } from '../c-boton/c-boton';
import { CoursesHttpClient } from '../../../services/courses-http-client';
import { LanguageInterface } from '../../../models/LanguageInterface';
import { LevelInterface } from '../../../models/LevelInterface';
import { TeacherInterface } from '../../../models/TeacherInterface';

@Component({
  selector: 'c-curso-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Boton
  ],
  templateUrl: './c-curso-form.html',
  styleUrl: './c-curso-form.scss',
})
export class CCursoForm {
  @Input() curso!: CourseInterface;
  @Input() modoEdicion: boolean = true;
  @Output() guardar = new EventEmitter<CourseInterface>();
  @Output() cancelar = new EventEmitter<void>();

  formulario!: FormGroup;
  teacherName!: string;
  allLanguages: LanguageInterface[] = [];
  allLevels: LevelInterface[] = [];
  allTeachers: TeacherInterface[] = [];
  constructor(private formBuilder: FormBuilder, private coursesHttpClient: CoursesHttpClient) {
  }

  ngOnInit() {
    this.crearFormulario();
    this.teacherName = this.curso.teacher?.username || '';
    this.formulario.patchValue({
      teacher: this.teacherName
    }, { emitEvent: false });
    this.coursesHttpClient.getAllLanguages().subscribe((data: LanguageInterface[]) => {
      this.allLanguages = data;
    });
    this.coursesHttpClient.getAllLevels().subscribe((data: LevelInterface[]) => {
      this.allLevels = data;
    });
    this.coursesHttpClient.getAllTeachers().subscribe((data: TeacherInterface[]) => {
      this.allTeachers = data;
    });
  }

  checkTeacherSelection(teacherName: string | null): boolean {
    if (!teacherName) {
      return true;
    }  
    return this.allTeachers.some(teacher => teacher.username === teacherName);
  }

  crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      title: [this.curso.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.curso.description || '', [Validators.required, Validators.minLength(10)]],
      price: [this.curso.price || 0, [Validators.required, Validators.min(0)]],
      durationHours: [this.curso.duration || 0, [Validators.required, Validators.min(1)]],
      language: [this.curso.language || '', Validators.required],
      level: [this.curso.level || '', Validators.required],
      teacher: [this.curso.teacher || '', Validators.required]
    });
  }

  onGuardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const cursoActualizado: CourseInterface = {
      ...this.curso,
      title: this.formulario.value.title,
      description: this.formulario.value.description,
      price: this.formulario.value.price,
      duration: this.formulario.value.durationHours,
      language: this.formulario.value.language,
      level: this.formulario.value.level,
      teacher: { ...this.curso.teacher, username: this.formulario.value.teacher }
    };

    this.guardar.emit(cursoActualizado);
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}
