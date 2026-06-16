import {Component, OnInit} from '@angular/core';
import {ResponseSpettacoloDTO} from "../../../dto/spettacolo/response/response-spettacolo-dto";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SpettacoloService} from "../../../services/spettacolo.service";
import {InsertSpettacoloDTO} from "../../../dto/spettacolo/request/insert-spettacolo-dto";
import {CommonModule} from "@angular/common";
import {FilmService} from "../../../services/film.service";
import {SalaService} from "../../../services/sala.service";
import {ConfirmDialogService} from "../../../services/confirm-dialog.service";
import {ResponseFilmDTO} from "../../../dto/film/response/response-film-dto";
import {ResponseSalaDTO} from "../../../dto/sala/response/response-sala-dto";
import {ActivatedRoute} from "@angular/router";
import {GestioneSpettacoliResolverData} from "../../../app.resolver";

@Component({
  selector: 'app-gestione-spettacoli',
  standalone: true,
  imports: [
    ReactiveFormsModule,CommonModule
  ],
  templateUrl: './gestione-spettacoli.component.html',
  styleUrl: './gestione-spettacoli.component.css'
})
export class GestioneSpettacoliComponent implements OnInit{

  spettacoli: ResponseSpettacoloDTO[] = [];
  listaFilm: ResponseFilmDTO[] = [];
  listaSale: ResponseSalaDTO[] = [];
  erroreInserimento: string | null = null;
  successoInserimento: string | null = null;


  formSpettacolo = new FormGroup({
    idFilm: new FormControl<number | null>(null, Validators.required),
    idSala: new FormControl<number | null>(null, Validators.required),
    data: new FormControl('', Validators.required),
    oraInizio: new FormControl('', Validators.required)
  });

  constructor(
      private route: ActivatedRoute,
      private spettacoloService: SpettacoloService,
      private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit(): void {
      const dati = this.route.snapshot.data['dati'] as GestioneSpettacoliResolverData;
      this.listaFilm  = dati.films      ?? [];
      this.listaSale  = dati.sale       ?? [];
      this.spettacoli = dati.spettacoli ?? [];
  }





  get filmSelezionato(): ResponseFilmDTO | undefined {
    const idFilm = this.formSpettacolo.controls.idFilm.value;
    return this.listaFilm.find(film => film.id === idFilm);
  }

  get durataFilmSelezionatoLabel(): string {
    const durata = this.filmSelezionato?.durata;
    if (!durata) {
      return 'Seleziona un film per calcolare la fine';
    }

    const ore = Math.floor(durata / 60);
    const minuti = durata % 60;
    return ore > 0 ? `${ore}h ${minuti.toString().padStart(2, '0')}m` : `${minuti} min`;
  }

  get oraFineStimata(): string {
    const film = this.filmSelezionato;
    const data = this.formSpettacolo.controls.data.value;
    const oraInizio = this.formSpettacolo.controls.oraInizio.value;

    if (!film?.durata || !data || !oraInizio) {
      return '--:--';
    }

    const dataOraInizio = new Date(`${data}T${oraInizio}:00`);
    dataOraInizio.setMinutes(dataOraInizio.getMinutes() + film.durata);

    return dataOraInizio.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  private getOraFineStimataIso(): string | null {
    const film = this.filmSelezionato;
    const data = this.formSpettacolo.controls.data.value;
    const oraInizio = this.formSpettacolo.controls.oraInizio.value;

    if (!film?.durata || !data || !oraInizio) {
      return null;
    }

    const dataOraInizio = new Date(`${data}T${oraInizio}:00`);
    dataOraInizio.setMinutes(dataOraInizio.getMinutes() + film.durata);

    const anno = dataOraInizio.getFullYear();
    const mese = String(dataOraInizio.getMonth() + 1).padStart(2, '0');
    const giorno = String(dataOraInizio.getDate()).padStart(2, '0');
    const ore = String(dataOraInizio.getHours()).padStart(2, '0');
    const minuti = String(dataOraInizio.getMinutes()).padStart(2, '0');
    const secondi = String(dataOraInizio.getSeconds()).padStart(2, '0');

    return `${anno}-${mese}-${giorno}T${ore}:${minuti}:${secondi}`;
  }

  salvaSpettacolo() {
      if (this.formSpettacolo.valid) {
          const formValue = this.formSpettacolo.value;
          const filmSelezionato = this.filmSelezionato;
          const salaSelezionata = this.listaSale.find(sala => sala.id === formValue.idSala);

          if (!filmSelezionato?.durata) {
              this.erroreInserimento = 'Seleziona un film valido per calcolare la durata dello spettacolo.';
              this.successoInserimento = null;
              return;
          }

          const dataSpettacolo = formValue.data; // YYYY-MM-DD
          const inizio = formValue.oraInizio;    // HH:mm

          const localDateTimeInizio = `${dataSpettacolo}T${inizio}:00`;
          const oraFineStimata = this.oraFineStimata;
          const localDateTimeFine = this.getOraFineStimataIso();

          if (!localDateTimeFine) {
              this.erroreInserimento = 'Non riesco a calcolare l’orario di fine dello spettacolo.';
              this.successoInserimento = null;
              return;
          }

          const spettacolo: InsertSpettacoloDTO = {
              idFilm: formValue.idFilm ? Number(formValue.idFilm) : 0,
              idSala: formValue.idSala ? Number(formValue.idSala) : 0,
              data: dataSpettacolo || '',
              oraInizio: localDateTimeInizio,
              oraFine: localDateTimeFine
          };

          this.erroreInserimento = null;
          this.successoInserimento = null;

          this.spettacoloService.insert(spettacolo).subscribe({
              next: () => {
                  this.spettacoloService.findByData(dataSpettacolo || '').subscribe({
                      next: (spettacoliInData) => {
                          const spettacoloInserito = spettacoliInData.find(s =>
                              s.idFilm === spettacolo.idFilm &&
                              s.data === spettacolo.data &&
                              s.oraInizio === spettacolo.oraInizio &&
                              (!salaSelezionata || s.nomeSala === salaSelezionata.nome)
                          );

                          if (!spettacoloInserito) {
                              this.successoInserimento = null;
                              this.erroreInserimento = 'Il backend ha risposto alla richiesta ma non ha salvato davvero lo spettacolo. Riavvia il backend in esecuzione e ricompilalo, perché al momento sta esponendo ancora una versione vecchia dell’endpoint.';
                              return;
                          }

                          this.formSpettacolo.reset();
                          this.successoInserimento = `Spettacolo programmato. Fine automatica prevista: ${oraFineStimata}.`;
                          this.erroreInserimento = null;
                          this.spettacoloService.findAll().subscribe(s => this.spettacoli = s);                      },
                      error: () => {
                          this.successoInserimento = null;
                          this.erroreInserimento = 'Il backend ha accettato la richiesta ma non restituisce il nuovo spettacolo. Riavvia il backend in esecuzione e ricompilalo prima di riprovare.';
                      }
                  });
                  },
              error: (err) => {
                  console.error("Errore durante l'inserimento dello spettacolo", err);
                  this.successoInserimento = null;
                  this.erroreInserimento = this.estraiMessaggioErrore(err);
              }
          });
      } else {
          this.successoInserimento = null;
          this.erroreInserimento = 'Compila film, sala, data e orario di inizio prima di programmare lo spettacolo.';
      }
  }

  private estraiMessaggioErrore(err: any): string {
      const erroriValidazione = err?.error?.errori;

      if (erroriValidazione && typeof erroriValidazione === 'object') {
          const etichette: Record<string, string> = {
              data: 'Data spettacolo',
              oraInizio: 'Ora inizio',
              oraFine: 'Ora fine',
              idSala: 'Sala',
              idFilm: 'Film'
          };

          return Object.entries(erroriValidazione)
              .map(([campo, messaggio]) => `${etichette[campo] ?? campo}: ${messaggio}`)
              .join(' | ');
      }

      if (err?.status === 0) {
          return 'Il backend non è raggiungibile. Verifica che il server su localhost:8080 sia avviato.';
      }

      return err?.error?.message || `Impossibile inserire lo spettacolo (HTTP ${err?.status ?? 'sconosciuto'}). Controlla conflitti di sala e orari.`;
  }

  elimina(id: number){
    this.confirmDialogService.confirm({
      title: 'Elimina spettacolo',
      message: 'Sei sicuro di voler eliminare questo spettacolo?',
      confirmText: 'Elimina'
    }).subscribe(conferma => {
      if (!conferma) {
        return;
      }

      this.spettacoloService.removeById(id).subscribe({
        next:() =>{
            this.spettacoli = this.spettacoli.filter(s => s.id !== id);
            this.confirmDialogService.notifySuccess('Spettacolo rimosso con successo.').subscribe();
        },
        error: (err) => {
          console.log('Errore durante la rimozione del spettacolo');
        }
      });
    });
  }

}
