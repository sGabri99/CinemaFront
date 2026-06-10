import { Component } from '@angular/core';
import {BigliettoService} from "../../../services/biglietto.service";
import {ResponseBigliettoDTO} from "../../../dto/biglietto/response/response-biglietto-dto";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-biglietti-utente',
  standalone: true,
  imports: [
    FormsModule,CommonModule,
    RouterLink
  ],
  templateUrl: './biglietti-utente.component.html',
  styleUrl: './biglietti-utente.component.css'
})
export class BigliettiUtenteComponent {

  idUtenteCercato: number | null = null;
  biglietti: ResponseBigliettoDTO[] = [];

  constructor(private bigliettoService: BigliettoService) {}

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


  cancellaBiglietto(idBiglietto: number){
    const email = prompt("Inserisci l'email per confermare: ");
    if(!email) return;

    if(confirm('Sei sicuro di voler eliminare il biglietto?')){
      this.bigliettoService.removeById(idBiglietto, email).subscribe({
        next: () => {
          alert('Biglietto eliminato con successo');
          this.cerca();
        },
        error: (err) => {
          console.error("Errore durante l'eliminazione del biglietto", err);
        }
      })
    }
  }


}
