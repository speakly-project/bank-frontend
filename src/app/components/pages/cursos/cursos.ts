import { Component } from '@angular/core';
import { CoursesHttpClient } from '../../../services/courses-http-client';
import { ActivatedRoute, Route, Router } from "@angular/router";
import { CourseInterface } from '../../../models/CourseInterface';
import { LanguageInterface } from '../../../models/LanguageInterface';
import { LevelInterface } from '../../../models/LevelInterface';
import { MatDialog } from '@angular/material/dialog';
import { CCursoDialog } from '../../ui/c-curso-dialog/c-curso-dialog';
import { Boton } from '../../ui/c-boton/c-boton';
import { CTag } from '../../ui/c-tag/c-tag';
import { CTable } from '../../ui/c-table/c-table';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'cursos',
  imports: [ Boton, CTag, CTable, DatePipe],
  templateUrl: './cursos.html',
  styleUrl: './cursos.scss',
})
export class Cursos {
  constructor(private dialog: MatDialog, private coursesHttpClient: CoursesHttpClient, private router: Router) { }

  courses: CourseInterface[] = [];
  allCourses: CourseInterface[] = [];
  languages: LanguageInterface[] = [];
  levels: LevelInterface[] = [];

  selectedLanguage: string = 'All';
  selectedLevel: string = 'All';

  ngOnInit() {
    this.coursesHttpClient.getAllCoursesWithTeachers().subscribe((data: any) => {
      this.courses = data ?? [];
      this.allCourses = data ?? [];
    });

    this.coursesHttpClient.getAllLanguages().subscribe((data: any) => {
      this.languages = data ?? [];
    });

    this.coursesHttpClient.getAllLevels().subscribe((data: any) => {
      this.levels = data ?? [];
    });
  }

  loadCourses() {
    const language = this.selectedLanguage;
    const level = this.selectedLevel;

    this.courses = this.allCourses.filter(curso => {
      const matchLanguage = language === 'All' || curso.language === language;
      const matchLevel = level === 'All' || curso.level === level;
      return matchLanguage && matchLevel;
    });
  }

  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLanguage = select.value;
    this.loadCourses();
  }

  onLevelChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLevel = select.value;
    this.loadCourses();
  }

  modificarCurso(id: number) {
    this.openCursoDialog(id, 'modificar');
  }

  borrarCurso(id: number) {
    this.openCursoDialog(id, 'borrar');
  }

  nuevoCurso() {
    const cursoVacio: CourseInterface = {
      id: 0,
      title: '',
      description: '',
      price: 0,
      duration: 0,
      language: '',
      level: '',
      teacherId: 0,
      createdAt: '',
      teacher: { id: 0, username: '', email: '', profilePictureUrl: '', createdAt: '' }
    };

    const dialogRef = this.dialog.open(CCursoDialog, {
      data: { curso: cursoVacio, accion: 'nuevo' },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.accion === 'nuevo') {
        this.ejecutarCreacion(result.curso);
      }
    });
  }

  openCursoDialog(id: number, accion: 'modificar' | 'borrar' | 'nuevo') {
    const curso = this.courses.find(c => c.id === id);

    if (!curso) return;

    const dialogRef = this.dialog.open(CCursoDialog, {
      data: { curso, accion },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //borrar dara string, modificar o nuevo dara objeto
        if (typeof result === 'string') {
          switch(result) {
            case 'borrar':
              this.ejecutarBorrado(id);
              break;
          }
        } else if (result.accion) {
          // modificar o nuevo
          switch(result.accion) {
            case 'modificar':
              this.ejecutarModificacion(result.curso);
              break;
          }
        }
      }
    });
  }

  ejecutarModificacion(cursoActualizado: CourseInterface) {
    const teacherUsername = cursoActualizado.teacher.username;

    this.coursesHttpClient.getUserByUsername(teacherUsername).subscribe({
      next: (user: any) => {
        if (!user) {
          console.error('Profesor no encontrado con el nombre:', teacherUsername);
          return;
        }

        const cursoRequest = {
          id: cursoActualizado.id,
          title: cursoActualizado.title,
          description: cursoActualizado.description,
          price: cursoActualizado.price,
          language: cursoActualizado.language,
          level: cursoActualizado.level,
          teacherId: user.id,
          duration: cursoActualizado.duration
        };

        this.coursesHttpClient.updateCourse(cursoActualizado.id, cursoRequest).subscribe({
          next: () => {
            this.coursesHttpClient.getAllCoursesWithTeachers().subscribe((data: any) => {
              this.courses = data;
              this.allCourses = data;
            });
            console.log('Curso actualizado exitosamente');
          },
          error: (error: any) => {
            console.error('Error al actualizar el curso:', error);
          }
        });
      },
      error: (error: any) => {
        console.error('Error al buscar el profesor:', error);
      }
    });
  }

  ejecutarCreacion(nuevoCurso: CourseInterface) {
    const teacherUsername = nuevoCurso.teacher.username;

    this.coursesHttpClient.getUserByUsername(teacherUsername).subscribe({
      next: (user: any) => {
        if (!user) {
          console.error('Profesor no encontrado con el nombre:', teacherUsername);
          return;
        }

        const cursoRequest = {
          title: nuevoCurso.title,
          description: nuevoCurso.description,
          price: nuevoCurso.price,
          language: nuevoCurso.language,
          level: nuevoCurso.level,
          teacherId: user.id,
          duration: nuevoCurso.duration
        };

        this.coursesHttpClient.createCourse(cursoRequest).subscribe({
          next: (response: any) => {
            this.coursesHttpClient.getAllCoursesWithTeachers().subscribe((data: any) => {
              this.courses = data;
              this.allCourses = data;
            });
            console.log('Curso creado exitosamente');
          },
          error: (error: any) => {
            console.error('Error al crear el curso:', error);
          }
        });
      },
      error: (error: any) => {
        console.error('Error al buscar el profesor:', error);
      }
    });
  }

  ejecutarBorrado(id: number) {
    this.coursesHttpClient.deleteCourse(id).subscribe({
      next: () => {
        this.courses = this.courses.filter(curso => curso.id !== id);
        console.log('Curso borrado exitosamente');
      },
      error: (error: any) => {
        console.error('Error al borrar el curso:', error);
      }
    });
  }

}