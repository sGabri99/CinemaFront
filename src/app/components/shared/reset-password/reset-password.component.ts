import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ResetPasswordRequest } from '../../../dto/resetpassword/request/reset-password-request';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  dto: ResetPasswordRequest = { token: '', password: '', confermaPassword: '' };
  loading = false;
  successo = false;
  errore: string | null = null;
  mostraPassword = false;
  mostraConferma = false;
  tokenMancante = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.dto.token = token;
    } else {
      this.tokenMancante = true;
    }
  }

  get passwordMatch(): boolean {
    return this.dto.password === this.dto.confermaPassword;
  }

  get formValido(): boolean {
    return !!(this.dto.token && this.dto.password && this.dto.confermaPassword && this.passwordMatch);
  }

  reimposta(): void {
    if (!this.formValido) {
      this.errore = !this.passwordMatch
        ? 'Le password non coincidono.'
        : 'Compila tutti i campi.';
      return;
    }
    this.loading = true;
    this.errore = null;

    this.authService.resetPassword(this.dto).subscribe({
      next: () => {
        this.loading = false;
        this.successo = true;
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.messaggio) {
          this.errore = err.error.messaggio;
        } else {
          this.errore = 'Codice non valido o scaduto. Richiedine uno nuovo.';
        }
      }
    });
  }
}
