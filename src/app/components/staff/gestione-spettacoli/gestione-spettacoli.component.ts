import {Component, OnInit} from '@angular/core';
import {ResponseSpettacoloDTO} from "../../../dto/spettacolo/response/response-spettacolo-dto";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SpettacoloService} from "../../../services/spettacolo.service";
import {InsertSpettacoloDTO} from "../../../dto/spettacolo/request/insert-spettacolo-dto";
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-gestione-spettacoli',
  standalone: true,
  imports: [
    ReactiveFormsModule,CommonModule,
    RouterLink
  ],
  templateUrl: './gestione-spettacoli.component.html',
  styleUrl: './gestione-spettacoli.component.css'
})
export class GestioneSpettacoliComponent implements OnInit{

  spettacoli: ResponseSpettacoloDTO[] = [];

  formSpettacolo = new FormGroup({
    idFilm: new FormControl<number | null>(null, Validators.required),
    idSala: new FormControl<number | null>(null, Validators.required),
    data: new FormControl('', Validators.required),
    oraInizio: new FormControl('', Validators.required),
    oraFine: new FormControl('', Validators.required)
  });

  constructor(private spettacoloService: SpettacoloService) { }

  ngOnInit(): void {
    this.caricaSpettacoli();
  }

  caricaSpettacoli(){
    this.spettacoloService.findAll().subscribe({
      next: (res: ResponseSpettacoloDTO[]) => {
        this.spettacoli = res;
      },
      error: (err) => {
        console.log('Errore durante il caricamento dei spettacoli');
      }
    })
  }

  salvaSpettacolo() {
      if (this.formSpettacolo.valid) {
          const formValue = this.formSpettacolo.value;

          const spettacolo: InsertSpettacoloDTO = {
              idFilm: formValue.idFilm ? Number(formValue.idFilm) : 0,
              idSala: formValue.idSala ? Number(formValue.idSala) : 0,
              data: formValue.data || '',
              oraInizio: formValue.oraInizio || '',
              oraFine: formValue.oraFine || ''
          };

          this.spettacoloService.insert(spettacolo).subscribe({
              next: () => {
                  alert('Spettacolo inserito con successo');
                    this.formSpettacolo.reset();
                    this.caricaSpettacoli();
                },
                error: (err) => {
                    console.error("Errore durante l'inserimento dello spettacolo", err);
                    alert("Impossibile inserire lo spettacolo. Verifica i dati o i permessi dello staff.");
                }
          });
      }
  }

  elimina(id: number){
    if(confirm('Vuoi rimuovere lo spettacolo?')){
      this.spettacoloService.removeById(id).subscribe({
        next:() =>{
          alert('Spettacolo rimosso con successo');
          this.caricaSpettacoli();
        },
        error: (err) => {
          console.log('Errore durante la rimozione del spettacolo');
        }
      })
    }
  }

}
