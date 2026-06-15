import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ResponseUtenteDataDTO} from "../../../dto/utente/response/response-utente-data-dto";

@Component({
  selector: 'app-crea-staff',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './crea-staff.component.html',
  styleUrl: './crea-staff.component.css'
})
export class CreaStaffComponent implements OnInit {
  listaStaff: ResponseUtenteDataDTO[] = [];
  staffForm: FormGroup;
  messaggioSuccesso: string | null = null;
  messaggioErrore: string | null = null;

  constructor(private formbuiler: FormBuilder, private authService: AuthService,) {
    this.staffForm = this.formbuiler.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confermaPassword: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.caricaListaStaff();
  }
  caricaListaStaff(): void {
    this.authService.getAllStaff().subscribe({
      next: (data) => {
        this.listaStaff = data;
      },
      error: (err) => console.error("Errore nel recupero staff:", err)
    });
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      this.authService.aggiungiStaff(this.staffForm.value).subscribe({
        next: () => {
          this.messaggioSuccesso = 'Staff aggiunto con successo.';
          this.messaggioErrore = null;
          this.staffForm.reset();
          this.caricaListaStaff();
        },
        error: (err) => {
          this.messaggioErrore = err.error?.message || 'Errore durante l\'aggiunta dello staff.';
          this.messaggioSuccesso = null;
        }
      });
    } else {
      this.messaggioErrore = 'Compila correttamente tutti i campi prima di creare il nuovo account.';
      this.messaggioSuccesso = null;
    }
  }
}
