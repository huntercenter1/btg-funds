import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe, NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TransactionsService } from '../../services/transactions.service';
import { FundsService } from '../../services/funds.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  standalone: true,
  selector: 'app-history-page',
  template: `
  <div class="wrapper">
    <table mat-table [dataSource]="rows" class="mat-elevation-z1">
      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef> Fecha </th>
        <td mat-cell *matCellDef="let r">{{ r.date | date:'short':'-0500' }}</td>
      </ng-container>
      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef> Tipo </th>
        <td mat-cell *matCellDef="let r">{{ r.type === 'SUBSCRIPTION' ? 'Suscripción' : 'Cancelación' }}</td>
      </ng-container>
      <ng-container matColumnDef="fund">
        <th mat-header-cell *matHeaderCellDef> Fondo </th>
        <td mat-cell *matCellDef="let r">{{ fundName(r.fundId) }}</td>
      </ng-container>
      <ng-container matColumnDef="amount">
        <th mat-header-cell *matHeaderCellDef> Monto </th>
        <td mat-cell *matCellDef="let r">{{ r.amount | currency:'COP':'symbol':'1.0-0'}}</td>
      </ng-container>
      <ng-container matColumnDef="notif">
        <th mat-header-cell *matHeaderCellDef> Notificación </th>
        <td mat-cell *matCellDef="let r">{{ r.notification || '-' }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols;"></tr>
    </table>
  </div>
  `,
  styles: [`.wrapper{padding:16px;overflow:auto}`],
  imports: [CommonModule, MatTableModule, DatePipe, CurrencyPipe]
})
export class HistoryPage implements OnInit {
  private readonly tx = inject(TransactionsService);
  private readonly fundsSrv = inject(FundsService);

  rows: Transaction[] = [];
  fundsMap = new Map<number, string>();
  cols = ['date','type','fund','amount','notif'];

  ngOnInit(){
    this.fundsSrv.getFunds().subscribe(fs => { fs.forEach(f => this.fundsMap.set(f.id, f.name)); });
    this.tx.getAll().subscribe(t => this.rows = t);
  }

  fundName(id: number){ return this.fundsMap.get(id) ?? `#${id}`; }
}
