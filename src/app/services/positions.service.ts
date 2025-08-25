import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { Position } from '../models/position.model';

@Injectable({ providedIn: 'root' })
export class PositionsService {
  private positions$ = new BehaviorSubject<Position[]>([]);
  readonly positions = this.positions$.asObservable();

  constructor(private http: HttpClient) {}

  load(): Observable<Position[]> {
    return this.http.get<Position[]>(`${env.apiUrl}/positions`).pipe(
      tap(p => this.positions$.next(p))
    );
  }

  findByFundId(fundId: number): Position | undefined {
    return this.positions$.value.find(p => p.fundId === fundId);
  }

  upsert(fundId: number, delta: number): Observable<Position> {
    const existing = this.findByFundId(fundId);
    if (existing) {
      const updated = { ...existing, amount: existing.amount + delta };
      return this.http.patch<Position>(`${env.apiUrl}/positions/${existing.id}`, { amount: updated.amount }).pipe(
        tap(p => this.positions$.next(this.positions$.value.map(x => x.id === p.id ? p : x)))
      );
    } else {
      const newPos = { fundId, amount: delta } as Omit<Position, 'id'>;
      return this.http.post<Position>(`${env.apiUrl}/positions`, newPos).pipe(
        tap(p => this.positions$.next([...this.positions$.value, p]))
      );
    }
  }

  remove(fundId: number): Observable<void> {
    const existing = this.findByFundId(fundId);
    if (!existing) return new Observable<void>(sub => { sub.next(); sub.complete(); });
    return this.http.delete<void>(`${env.apiUrl}/positions/${existing.id}`).pipe(
      tap(() => this.positions$.next(this.positions$.value.filter(x => x.id !== existing.id)))
    );
  }
}
