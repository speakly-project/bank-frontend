import { Component } from '@angular/core';
import { CoursesHttpClient } from '../../../services/courses-http-client';
import { Router } from "@angular/router";
import { UserInterface } from '../../../models/UserInterface';
import { MatDialog } from '@angular/material/dialog';
import { CUserDialog } from '../../ui/c-user-dialog/c-user-dialog';
import { Boton } from '../../ui/c-boton/c-boton';
import { CTag } from '../../ui/c-tag/c-tag';
import { DatePipe } from '@angular/common';
import { CTable } from '../../ui/c-table/c-table';


@Component({
  selector: 'users',
  imports: [Boton, CTag, DatePipe, CTable],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  constructor(private dialog: MatDialog, private coursesHttpClient: CoursesHttpClient, private router: Router) { }

  users: UserInterface[] = [];
  allUsers: UserInterface[] = [];

  selectedRole: string = 'All';

  getUserId(user: any): number {
    const rawId = user?.id ?? user?.userId ?? user?.user_id ?? user?._id;
    const numericId = typeof rawId === 'string' ? Number(rawId) : rawId;
    return Number.isFinite(numericId) ? numericId : 0;
  }

  normalizeRole(user: any): UserInterface['role'] {
    const rawRole =
      user?.role ??
      user?.userRole ??
      user?.roles ??
      user?.authorities ??
      user?.authority;

    const pickFirst = (value: any) => (Array.isArray(value) ? value[0] : value);
    const first = pickFirst(rawRole);

    const roleString: string =
      typeof first === 'string'
        ? first
        : typeof first?.authority === 'string'
          ? first.authority
          : typeof first?.name === 'string'
            ? first.name
            : '';

    const normalized = roleString.toUpperCase();

    if (normalized.includes('ADMIN')) return 'ADMIN';
    return 'USER';
  }

  normalizeUser(raw: any): UserInterface {
    return {
      id: this.getUserId(raw),
      username: raw?.username ?? raw?.name ?? '',
      email: raw?.email ?? '',
      profilePictureUrl: raw?.profilePictureUrl ?? raw?.profile_picture_url ?? null,
      createdAt: raw?.createdAt ?? raw?.created_at ?? '',
      coursesTaken: raw?.coursesTaken ?? raw?.courses_taken ?? [],
      role: this.normalizeRole(raw),
    };
  }

  refreshUsers() {
    this.coursesHttpClient.getAllUsers().subscribe((data: any[]) => {
      const normalized = (data ?? []).map(u => this.normalizeUser(u));
      this.users = normalized;
      this.allUsers = normalized;
      this.loadUsers();
    });
  }

  ngOnInit() {
    this.refreshUsers();
  }

  loadUsers() {
    const role = this.selectedRole;

    this.users = this.allUsers.filter(user => {
      const matchRole = role === 'All' || user.role === role;
      return matchRole;
    });
  }

  onRoleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedRole = select.value;
    this.loadUsers();
  }

  modificarUser(id: number) {
    this.openUserDialog(id, 'modificar');
  }

  borrarUser(id: number) {
    this.openUserDialog(id, 'borrar');
  }

  nuevoUser() {
    const userVacio: UserInterface = {
      id: 0,
      username: '',
      email: '',
      profilePictureUrl: '',
      createdAt: '',
      coursesTaken: [],
      role: 'USER'
    };

    const dialogRef = this.dialog.open(CUserDialog, {
      data: { user: userVacio, accion: 'nuevo' },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.accion === 'nuevo') {
        this.ejecutarCreacion(result.user);
      }
    });
  }

  openUserDialog(id: number, accion: 'modificar' | 'borrar' | 'nuevo') {
    const user = this.allUsers.find(u => u.id === id) ?? this.users.find(u => u.id === id);

    if (!user) return;

    const dialogRef = this.dialog.open(CUserDialog, {
      data: { user, accion },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (typeof result === 'string') {
          switch(result) {
            case 'borrar':
              this.ejecutarBorrado(id);
              break;
          }
        } else if (result.accion) {
          switch(result.accion) {
            case 'modificar':
              this.ejecutarModificacion(result.user ?? result.usuario ?? result);
              break;
            case 'nuevo':
              this.ejecutarCreacion(result.user ?? result.usuario ?? result);
              break;
          }
        }
      }
    });
  }

  ejecutarModificacion(userActualizado: UserInterface) {
    const userRequest = {
      id: userActualizado.id,
      username: userActualizado.username,
      email: userActualizado.email,
      profilePictureUrl: userActualizado.profilePictureUrl,
      password: null,
      coursesIds: null,
      role: userActualizado.role
    };


    this.coursesHttpClient.updateUser(userActualizado.id, userRequest).subscribe({
      next: () => {
        this.refreshUsers();
        console.log('Usuario actualizado exitosamente');
      },
      error: (error: any) => {
        console.error('Error al actualizar el usuario:', error);
      }
    });
  }

  ejecutarCreacion(nuevoUser: UserInterface) {
    const userRequest = {
      username: nuevoUser.username,
      email: nuevoUser.email,
      profilePictureUrl: nuevoUser.profilePictureUrl,
      password: nuevoUser.password,
      role: nuevoUser.role
    };

    this.coursesHttpClient.createUser(userRequest).subscribe({
      next: (response: any) => {
        this.refreshUsers();
        console.log('Usuario creado exitosamente');
      },
      error: (error: any) => {
        console.error('Error al crear el usuario:', error);
      }
    });
  }

  ejecutarBorrado(id: number) {
    this.coursesHttpClient.deleteUser(id).subscribe({
      next: () => {
        this.refreshUsers();
        console.log('Usuario borrado exitosamente');
      },
      error: (error: any) => {
        console.error('Error al borrar el usuario:', error);
      }
    });
  }

}
