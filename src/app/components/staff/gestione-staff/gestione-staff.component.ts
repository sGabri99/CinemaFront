import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StaffService } from '../../../services/staff.service';
import { InsertUtenteDTO } from '../../../dto/utente/request/insert-utente-dto';

@Component({
  selector: 'app-gestione-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestione-staff.component.html',
  styleUrls: ['./gestione-staff.component.css']
})
export class GestioneStaffComponent implements OnInit {

  staffForm!: FormGroup;
  messaggioSuccesso: string | null = null;
  messaggioErrore: string | null = null;

  constructor(
      private fb: FormBuilder,
      private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.staffForm = this.fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      ruolo: ['', [Validators.required]],
      telefono: ['']
    });
  }

  get ruoloSelezionatoLabel(): string {
    const ruolo = this.staffForm?.get('ruolo')?.value;

    if (ruolo === 'SUPERADMIN') {
      return 'Super Admin';
    }

    if (ruolo === 'STAFF') {
      return 'Staff';
    }

    return 'Ruolo non selezionato';
  }

  onSubmit(): void {
    if (this.staffForm.invalid) {
      this.messaggioErrore = 'Per favore, compila tutti i campi obbligatori correttamente.';
      this.messaggioSuccesso = null;
      return;
    }

    const nuovoStaff: InsertUtenteDTO = this.staffForm.value;

    this.staffService.aggiungiStaff(nuovoStaff).subscribe({
      next: (response) => {
        this.messaggioSuccesso = `Membro dello staff inserito con successo!`;
        this.messaggioErrore = null;
        this.staffForm.reset();
      },
      error: (err) => {
        this.messaggioErrore = "Si è verificato un errore durante l'inserimento dello staff.";
        this.messaggioSuccesso = null;
        console.error(err);
      }
    });
  }
}
