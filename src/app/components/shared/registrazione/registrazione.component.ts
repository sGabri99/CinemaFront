import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { InsertUtenteDTO } from '../../../dto/utente/request/insert-utente-dto';

@Component({
  selector: 'app-registrazione',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registrazione.component.html',
  styleUrl: './registrazione.component.css'
})
export class RegistrazioneComponent {
  dto: InsertUtenteDTO = {
    nome: '',
    cognome: '',
    email: '',
    password: '',
    confermaPassword: ''
  };

  loading = false;
  successo = false;
  errore: string | null = null;
  mostraPassword = false;
  mostraConferma = false;

  constructor(
      private authService: AuthService,
      private router: Router
  ) {}

  get passwordMatch(): boolean {
    return this.dto.password === this.dto.confermaPassword;
  }

  get formValido(): boolean {
    return !!(
        this.dto.nome &&
        this.dto.cognome &&
        this.dto.email &&
        this.dto.password &&
        this.dto.confermaPassword &&
        this.passwordMatch
    );
  }

  registra(): void {
    if (!this.formValido) {
      this.errore = !this.passwordMatch
          ? 'Le password non coincidono.'
          : 'Compila tutti i campi obbligatori.';
      return;
    }

    this.loading = true;
    this.errore = null;

    this.authService.registrazione(this.dto).subscribe({
      next: () => {
        this.loading = false;
        this.successo = true;
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.errore = 'Email già registrata. Prova ad accedere.';
        } else if (err.error?.messaggio) {
          this.errore = err.error.messaggio;
        } else {
          this.errore = 'Errore durante la registrazione. Riprova più tardi.';
        }
      }
    });
  }
}
