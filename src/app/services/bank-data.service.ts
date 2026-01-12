import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth-service';
import { BankAccountInterface, BankCreditCardInterface, BankUserInterface } from '../models/BankInterfaces';

@Injectable({
  providedIn: 'root',
})
export class BankDataService {
  private readonly usersUrl = 'http://localhost:3000/users';

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getCurrentUser(): Observable<BankUserInterface | null> {
    const token = this.authService.getToken();
    if (!token) {
      return of(null);
    }

    // Normalmente el token es api_key; fallback a id si hiciera falta.
    return this.http
      .get<BankUserInterface[]>(this.usersUrl, {
        params: new HttpParams().set('api_key', token),
      })
      .pipe(
        switchMap((usersByApiKey) => {
          const user = Array.isArray(usersByApiKey) ? usersByApiKey[0] : null;
          if (user) {
            return of(user);
          }

          return this.http.get<BankUserInterface[]>(this.usersUrl, {
            params: new HttpParams().set('id', token),
          });
        }),
        map((res) => (Array.isArray(res) ? res[0] ?? null : (res as any) ?? null)),
        catchError(() => of(null))
      );
  }

  getAccounts(): Observable<BankAccountInterface[]> {
    return this.getCurrentUser().pipe(map((u) => u?.accounts ?? []));
  }

  getCards(): Observable<BankCreditCardInterface[]> {
    return this.getAccounts().pipe(
      map((accounts) =>
        accounts.flatMap((a) => (Array.isArray(a.credit_cards) ? a.credit_cards : []))
      )
    );
  }
}
