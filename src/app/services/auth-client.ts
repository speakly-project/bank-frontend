import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUserInterface } from '../models/LoginUserInterface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthClient {
  apiUrl = environment.apiUrl + 'api/speakly-bank';

  HttpClient = inject(HttpClient);

  // POST /api/speakly-bank/auth/login -> text token
  login(loginInfo: { username: string; password: string }): Observable<string> {
    return this.HttpClient.post(`${this.apiUrl}/auth/login`, loginInfo, { responseType: 'text' });
  }

  logout(): Observable<void> {
    return this.HttpClient.post<void>(`${this.apiUrl}/auth/logout`, {});
  }

  getCurrentUserFromToken(): Observable<LoginUserInterface> {
    return this.HttpClient.get<LoginUserInterface>(`${this.apiUrl}/auth`);
  }
  // Extra helpers (optional, require backend endpoints if used)
  // getUserById(userId: number): Observable<LoginUserInterface> {
  //   return this.HttpClient.get<LoginUserInterface>(`${this.apiUrl}/users/${userId}`);
  // }

}
