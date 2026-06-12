import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EditPasswordRequest } from '../../../dto/resetpassword/request/edit-password-request';


@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css'
})
export class ProfiloComponent implements OnInit {
  email = '';
  ruolo = '';

  dto: EditPasswordRequest = { email: '', passwordVecchia: '', passwordNuova: '' };
  loading = false;
  successo = false;
  errore: string | null = null;
  mostraVecchia = false;
  mostraNuova = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

      this.email = this.authService.getEmail()
      this.ruolo = this.authService.getRuolo()
      this.dto.email = this.email;
 
  }

  cambiaPassword(): void {
    if (!this.dto.passwordVecchia || !this.dto.passwordNuova) {
      this.errore = 'Compila tutti i campi.';
      return;
    }
    this.loading = true;
    this.errore = null;
    this.successo = false;

    this.authService.editPassword(this.dto).subscribe({
      next: () => {
        this.loading = false;
        this.successo = true;
        this.dto.passwordVecchia = '';
        this.dto.passwordNuova = '';
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401 || err.status === 400) {
          this.errore = 'Password attuale non corretta.';
        } else {
          this.errore = 'Errore durante il salvataggio. Riprova più tardi.';
        }
      }
    });
  }


}
