import { Component } from '@angular/core';
import {BigliettoService} from "../../../services/biglietto.service";
import {ResponseBigliettoDTO} from "../../../dto/biglietto/response/response-biglietto-dto";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ConfirmDialogService} from "../../../services/confirm-dialog.service";

@Component({
  selector: 'app-biglietti-utente',
  standalone: true,
  imports: [
    FormsModule,CommonModule
  ],
  templateUrl: './biglietti-utente.component.html',
  styleUrl: './biglietti-utente.component.css'
})
export class BigliettiUtenteComponent {

  idUtenteCercato: number | null = null;
  biglietti: ResponseBigliettoDTO[] = [];

  constructor(
    private bigliettoService: BigliettoService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  cerca(){
    if(!this.idUtenteCercato) return;

    this.bigliettoService.findByIdUtente(this.idUtenteCercato).subscribe({
      next: (res) =>{
        this.biglietti = res;
      },
      error: (err) => {
        console.error("Errore durante la ricerca dei biglietti", err);
      }
    });
  }


  cancellaBiglietto(idBiglietto: number) {
    this.confirmDialogService.confirm({
      title: 'Elimina biglietto',
      message: 'Sei sicuro di voler eliminare questo biglietto?',
      confirmText: 'Elimina'
    }).subscribe(conferma => {
      if (!conferma) {
        return;
      }

      const email = prompt("Inserisci l'email per confermare l'annullamento: ");
      if (!email || !email.trim()) {
        alert("Email obbligatoria per procedere.");
        return;
      }

      this.bigliettoService.removeById(idBiglietto, email.trim()).subscribe({
        next: () => {
          alert('Biglietto eliminato con successo');
          this.biglietti = this.biglietti.filter(b => b.id !== idBiglietto);
        },
        error: (err) => {
          console.error("Errore durante l'eliminazione del biglietto", err);
          alert("Impossibile eliminare il biglietto. Verifica che l'email inserita sia corretta.");
        }
      });
    });
  }


}
