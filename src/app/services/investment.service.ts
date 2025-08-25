import { Injectable } from '@angular/core';
import { catchError, concatMap, map, throwError } from 'rxjs';
import { WalletService } from './wallet.service';
import { PositionsService } from './positions.service';
import { TransactionsService } from './transactions.service';
import { Fund } from '../models/fund.model';
import { NotificationMethod } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  constructor(
    private wallet: WalletService,
    private positions: PositionsService,
    private tx: TransactionsService,
  ) {}

  subscribe(fund: Fund, amount: number, notification: NotificationMethod) {
    if (amount < fund.minAmount) {
      return throwError(() => new Error(`El monto mínimo es COP ${fund.minAmount.toLocaleString('es-CO')}`));
    }
    if (this.wallet.current < amount) {
      return throwError(() => new Error('Saldo insuficiente'));
    }
    return this.wallet.debit(amount).pipe(
      concatMap(() => this.positions.upsert(fund.id, amount)),
      concatMap(() => this.tx.log({ type: 'SUBSCRIPTION', fundId: fund.id, amount, notification })),
      catchError(err => throwError(() => err))
    );
  }

  cancel(fund: Fund) {
    const pos = this.positions.findByFundId(fund.id);
    if (!pos || pos.amount <= 0) {
      return throwError(() => new Error('No tienes participación en este fondo'));
    }
    const amount = pos.amount;
    return this.positions.remove(fund.id).pipe(
      concatMap(() => this.wallet.credit(amount)),
      concatMap(() => this.tx.log({ type: 'CANCELLATION', fundId: fund.id, amount })),
      map(() => amount)
    );
  }
}
