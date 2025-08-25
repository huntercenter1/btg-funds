import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment as env } from '../../environments/environment';

interface Wallet { id: number; balance: number; }

@Injectable({ providedIn: 'root' })
export class WalletService {
  private balance$ = new BehaviorSubject<number>(0);
  readonly balance = this.balance$.asObservable();

  constructor(private http: HttpClient) {}

  load(): Observable<number> {
    return this.http.get<Wallet[]>(`${env.apiUrl}/wallet`).pipe(
      map(arr => arr?.[0]?.balance ?? 0),
      tap(b => this.balance$.next(b))
    );
  }

  get current(): number { return this.balance$.value; }

  debit(amount: number): Observable<Wallet> {
    const newBal = this.current - amount;
    return this.http.patch<Wallet>(`${env.apiUrl}/wallet/1`, { balance: newBal }).pipe(
      tap(w => this.balance$.next(w.balance))
    );
  }

  credit(amount: number): Observable<Wallet> {
    const newBal = this.current + amount;
    return this.http.patch<Wallet>(`${env.apiUrl}/wallet/1`, { balance: newBal }).pipe(
      tap(w => this.balance$.next(w.balance))
    );
  }
}
