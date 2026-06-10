import {Component, OnInit} from '@angular/core';
import {ResponseSpettacoloDTO} from "../../../dto/spettacolo/response/response-spettacolo-dto";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SpettacoloService} from "../../../services/spettacolo.service";
import {InsertSpettacoloDTO} from "../../../dto/spettacolo/request/insert-spettacolo-dto";

@Component({
  selector: 'app-gestione-spettacoli',
  standalone: true,
  imports: [
    ReactiveFormsModule
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

  salvaSpettacolo(){
    if(this.formSpettacolo.valid){
      const spettacolo = this.formSpettacolo.value as InsertSpettacoloDTO;

      this.spettacoloService.insert(spettacolo).subscribe({
        next:() => {
          alert('Spettacolo inserito con successo');
          this.formSpettacolo.reset();
          this.caricaSpettacoli();
        },
        error: (err) => {
          console.log('Errore durante l\'inserimento del spettacolo');
        }
      })
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
