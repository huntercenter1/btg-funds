import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { Fund } from '../models/fund.model';

@Injectable({ providedIn: 'root' })
export class FundsService {
  constructor(private http: HttpClient) {}
  getFunds(): Observable<Fund[]> {
    return this.http.get<Fund[]>(`${env.apiUrl}/funds`);
  }
}
