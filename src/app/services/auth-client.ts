import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInterface } from '../models/UserInterface';
import { LoginUserInterface } from '../models/LoginUserInterface';


@Injectable({
  providedIn: 'root',
})
export class AuthClient {
  apiUrl = 'http://localhost:8080/api/speakly';
  loginUrl = 'http://localhost:3000/users';

  HttpClient = inject(HttpClient);

  login(loginInfo: { login: string; password: string }): Observable<string> {
    const login = encodeURIComponent(loginInfo.login);

    return this.HttpClient.get<any[]>(`${this.loginUrl}?login=${login}`).pipe(
      map((users) => {
        const candidates = Array.isArray(users) ? users : [];

        const matchedUser = candidates.find((u) => {
          const storedPassword = u?.encryptedPassword ?? u?.password;
          return storedPassword === loginInfo.password;
        });

        if (!matchedUser) {
          throw new Error('Credenciales inválidas');
        }

        const token =
          matchedUser.api_key ??
          matchedUser.api_token ??
          matchedUser.apiKey ??
          matchedUser.token ??
          matchedUser.id;

        if (token == null) {
          throw new Error('Token no disponible');
        }

        return String(token);
      })
    );
  }

  logout(): Observable<void> {
    return of(void 0);
  }

  getCurrentUserFromToken(): Observable<LoginUserInterface> {
    return this.HttpClient.get<LoginUserInterface>(`${this.apiUrl}/auth`);
  }
  getUserByLogin(login: string): Observable<LoginUserInterface> {
    const encoded = encodeURIComponent(login);
    return this.HttpClient.get<LoginUserInterface>(`${this.loginUrl}?login=${encoded}`);
  }

  getUserById(userId: number): Observable<UserInterface> {
    return this.HttpClient.get<UserInterface>(`${this.apiUrl}/users/${userId}`);
  }
}
