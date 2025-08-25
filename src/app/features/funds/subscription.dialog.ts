import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { Fund } from '../../models/fund.model';
import { InvestmentService } from '../../services/investment.service';
import { NotificationMethod } from '../../models/transaction.model';

@Component({
  standalone: true,
  selector: 'app-subscription-dialog',
  templateUrl: './subscription.dialog.html',
  styleUrls: ['./subscription.dialog.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    CurrencyPipe,
  ],
})
export class SubscriptionDialog {
  private readonly fb = inject(FormBuilder);
  private readonly inv = inject(InvestmentService);
  private readonly snack = inject(MatSnackBar);

  loading = false;

  // Inicializa SIN usar this.data; se añade el min en el constructor
  form = this.fb.group({
    amount: [0, [Validators.required]],
    notification: ['email', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Fund,
    private ref: MatDialogRef<SubscriptionDialog>
  ) {
    // Ahora sí, con data disponible, agregamos el min correspondiente
    this.form.get('amount')?.addValidators(Validators.min(this.data.minAmount));
    this.form.get('amount')?.updateValueAndValidity({ emitEvent: false });
  }

  close() {
    this.ref.close();
  }

  submit() {
    if (this.form.invalid) return;
    const { amount, notification } = this.form.getRawValue();
    this.loading = true;
    this.inv.subscribe(this.data, Number(amount), notification as NotificationMethod).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Suscripción exitosa', 'OK', { duration: 2500 });
        this.close();
      },
      error: (e) => {
        this.loading = false;
        this.snack.open(e?.message || 'Error en la suscripción', 'OK', { duration: 3000 });
      },
    });
  }
}
