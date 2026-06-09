import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  inviata = false;
  errore: string | null = null;

  constructor(private authService: AuthService) {}

  invia(): void {
    if (!this.email) {
      this.errore = 'Inserisci la tua email.';
      return;
    }
    this.loading = true;
    this.errore = null;

    this.authService.invioResetPassword(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.inviata = true;
      },
      error: () => {
        this.loading = false;
        this.inviata = true;
      }
    });
  }
}
