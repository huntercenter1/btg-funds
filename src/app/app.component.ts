import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CurrencyPipe, NgIf } from '@angular/common';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    AsyncPipe,
    CurrencyPipe,
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private wallet = inject(WalletService);
  readonly balance$ = this.wallet.balance;

  constructor() {
    this.wallet.load().subscribe();
  }
}
