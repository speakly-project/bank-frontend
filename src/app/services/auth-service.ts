import { inject, Injectable } from '@angular/core';
import { AuthClient } from './auth-client';
import { Observable, of, catchError, map } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(AuthClient);
  private readonly TOKEN_KEY = 'authToken';

  login(email: string, password: string): Observable<string> {
    return new Observable((observer) => {
      const loginRequest = { email, password };

      this.httpClient.getUserByEmail(email).subscribe({
        next: (user) => {
          if (user.role !== 'ADMIN') {
            observer.error('Acceso denegado: no es administrador');
            return;
          }

          this.httpClient.login(loginRequest).subscribe({
            next: (token: string) => {
              localStorage.setItem(this.TOKEN_KEY, token);
              observer.next(token);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): Observable<boolean> {
    if (!this.getToken()) {
      return of(false);
    }

    return this.httpClient.getCurrentUserFromToken().pipe(
      map(user => user.role === 'ADMIN'),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.httpClient.logout().subscribe({
      next: () => {
        localStorage.removeItem(this.TOKEN_KEY);
      },
      error: (error) => {
        console.error('Logout failed', error);
        localStorage.removeItem(this.TOKEN_KEY);
      },
    });
  }
}
