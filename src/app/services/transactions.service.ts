import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${env.apiUrl}/transactions?_sort=date&_order=desc`);
  }

  log(tx: Omit<Transaction, 'id' | 'date'>): Observable<Transaction> {
    return this.http.post<Transaction>(`${env.apiUrl}/transactions`, { ...tx, date: new Date().toISOString() });
  }
}
