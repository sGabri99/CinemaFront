import {Component, OnInit} from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import {ResponseBigliettoDTO} from "../../../dto/biglietto/response/response-biglietto-dto";
import {BigliettoService} from "../../../services/biglietto.service";
import {forkJoin} from "rxjs";
import {SpettacoloService} from "../../../services/spettacolo.service";
import {ResponseSpettacoloDTO} from "../../../dto/spettacolo/response/response-spettacolo-dto";
import {ResponseFilmDTO} from "../../../dto/film/response/response-film-dto";
import {FilmService} from "../../../services/film.service";
import {DatePipe} from "@angular/common";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-imiei-biglietti',
  imports: [QRCodeComponent, DatePipe],
  templateUrl: './imiei-biglietti.component.html',
  styleUrl: './imiei-biglietti.component.css'
})
export class IMieiBigliettiComponent implements OnInit {
  biglietti: ResponseBigliettoDTO[] = [];
  spettacoli: ResponseSpettacoloDTO[] = [];
  film: ResponseFilmDTO[] = [];

  constructor(
    private filmService: FilmService,
    private bigliettoService: BigliettoService,
    private spettacoloService: SpettacoloService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    forkJoin({
      biglietti: this.bigliettoService.clientebiglietti(),
      spettacoli: this.spettacoloService.findAll()
    }).subscribe(res => {
      this.biglietti = res.biglietti;
      this.spettacoli = res.spettacoli;
    });
  }

  getSpettacoliConBiglietti() {
    const idSpettacoliUtente = new Set(this.biglietti.map(b => b.idSpettacolo));
    return this.spettacoli.filter(s => idSpettacoliUtente.has(s.id));
  }

  getBigliettiPerSpettacolo(idSpettacolo: number) {
    return this.biglietti.filter(b => b.idSpettacolo === idSpettacolo);
  }

  /**
   * Restituisce true se lo spettacolo inizia fra più di un'ora rispetto all'ora attuale.
   */
  isCancellabile(spettacolo: ResponseSpettacoloDTO): boolean {
    const dataOraInizio = new Date(spettacolo.oraInizio);
    const oraLimite = new Date(Date.now() + 60 * 60 * 1000); // ora corrente + 1 ora
    return dataOraInizio > oraLimite;
  }

  cancellaBiglietto(biglietto: ResponseBigliettoDTO, spettacolo: ResponseSpettacoloDTO): void {
    if (!this.isCancellabile(spettacolo)) {
      return;
    }

    const email = this.authService.getEmail();
    if (!email) {
      return;
    }

    if (!confirm(`Sei sicuro di voler cancellare questo biglietto per "${spettacolo.nomeFilm}"?`)) {
      return;
    }

    this.bigliettoService.removeById(biglietto.id, email).subscribe({
      next: () => {
        this.biglietti = this.biglietti.filter(b => b.id !== biglietto.id);
      },
      error: (err) => {
        console.error('Errore durante la cancellazione del biglietto:', err);
      }
    });
  }
}
