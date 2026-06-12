import {Component, OnInit} from '@angular/core';
import {ResponseSpettacoloDTO} from "../../../dto/spettacolo/response/response-spettacolo-dto";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SpettacoloService} from "../../../services/spettacolo.service";
import {InsertSpettacoloDTO} from "../../../dto/spettacolo/request/insert-spettacolo-dto";
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FilmService} from "../../../services/film.service";
import {SalaService} from "../../../services/sala.service";

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
  listaFilm: any[] = [];
  listaSale: any[] = [];


  formSpettacolo = new FormGroup({
    idFilm: new FormControl<number | null>(null, Validators.required),
    idSala: new FormControl<number | null>(null, Validators.required),
    data: new FormControl('', Validators.required),
    oraInizio: new FormControl('', Validators.required),
    oraFine: new FormControl('', Validators.required)
  });

  constructor(private spettacoloService: SpettacoloService, private filmService: FilmService,private salaService: SalaService) { }

  ngOnInit(): void {
    this.caricaSpettacoli();
    this.caricaFilm();
    this.caricaSale();
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

  caricaFilm() {
      // Chiamata al backend per prendere tutti i film disponibili
      this.filmService.findAll().subscribe({
          next: (res) => {
              this.listaFilm = res;
              },
            error: (err) => {
                console.error('Errore nel caricamento dei film per la select', err);
            }
        });
    }

    caricaSale() {
        // Chiamata al backend per prendere tutte le sale disponibili
        this.salaService.findAll().subscribe({
            next: (res) => {
                this.listaSale = res;
            },
            error: (err) => {
                console.error('Errore nel caricamento delle sale per la select', err);
            }
        });
    }

  salvaSpettacolo() {
      if (this.formSpettacolo.valid) {
          const formValue = this.formSpettacolo.value;

          const dataSpettacolo = formValue.data; // YYYY-MM-DD
          const inizio = formValue.oraInizio;    // HH:mm
          const fine = formValue.oraFine;        // HH:mm

          const localDateTimeInizio = `${dataSpettacolo}T${inizio}:00`;
          const localDateTimeFine = `${dataSpettacolo}T${fine}:00`;

          const spettacolo: InsertSpettacoloDTO = {
              idFilm: formValue.idFilm ? Number(formValue.idFilm) : 0,
              idSala: formValue.idSala ? Number(formValue.idSala) : 0,
              data: dataSpettacolo || '',
              oraInizio: localDateTimeInizio,
              oraFine: localDateTimeFine
          };

          this.spettacoloService.insert(spettacolo).subscribe({
              next: () => {
                  console.log('Spettacolo inserito con successo');
                  this.formSpettacolo.reset();
                  this.caricaSpettacoli();
                  },
              error: (err) => {
                  console.error("Errore durante l'inserimento dello spettacolo", err);
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
