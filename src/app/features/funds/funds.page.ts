import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FundsService } from '../../services/funds.service';
import { PositionsService } from '../../services/positions.service';
import { InvestmentService } from '../../services/investment.service';
import { Fund } from '../../models/fund.model';
import { SubscriptionDialog } from './subscription.dialog';

@Component({
  standalone: true,
  selector: 'app-funds-page',
  templateUrl: './funds.page.html',
  styleUrls: ['./funds.page.css'],
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class FundsPage implements OnInit {
  private readonly fundsSrv = inject(FundsService);
  private readonly positions = inject(PositionsService);
  private readonly inv = inject(InvestmentService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  funds: Fund[] = [];

  ngOnInit() {
    this.fundsSrv.getFunds().subscribe((f) => (this.funds = f));
    this.positions.load().subscribe();
  }

  hasPosition(fundId: number) {
    return !!this.positions.findByFundId(fundId);
  }
  amountInvested(fundId: number) {
    return this.positions.findByFundId(fundId)?.amount ?? 0;
  }

  openSubscribe(fund: Fund) {
    this.dialog.open(SubscriptionDialog, {
      data: fund,
      panelClass: 'btg-dialog',
      width: undefined, // dejamos que el CSS mande
      autoFocus: false, // ya pusimos autofocus en el input
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '120ms',
    });
  }

  cancel(fund: Fund) {
    this.inv.cancel(fund).subscribe({
      next: (amt) =>
        this.snack.open(`Cancelación exitosa (+${amt.toLocaleString('es-CO')} COP)`, 'OK', {
          duration: 2500,
        }),
      error: (e) => this.snack.open(e?.message || 'Error al cancelar', 'OK', { duration: 3000 }),
    });
  }
}
