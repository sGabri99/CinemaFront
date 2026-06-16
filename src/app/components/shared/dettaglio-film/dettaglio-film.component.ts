import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { ResponseSpettacoloDTO } from '../../../dto/spettacolo/response/response-spettacolo-dto';
import { FilmService } from '../../../services/film.service';
import { SpettacoloService } from '../../../services/spettacolo.service';
import { AuthService } from '../../../services/auth.service';
import { Ruolo } from '../../../enums/ruolo';
import { AcquistoBigliettoComponent } from '../acquisto-biglietto/acquisto-biglietto.component';
import { ResponseBigliettoDTO } from '../../../dto/biglietto/response/response-biglietto-dto';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import {DettaglioFilmResolverData} from "../../../app.resolver";

@Component({
  selector: 'app-dettaglio-film',
  imports: [CommonModule, RouterLink, AcquistoBigliettoComponent],
  templateUrl: './dettaglio-film.component.html',
  standalone: true,
  styleUrl: './dettaglio-film.component.css'
})
export class DettaglioFilmComponent implements OnInit {
  film?: ResponseFilmDTO;
  spettacoli: ResponseSpettacoloDTO[] = [];

  loadingFilm = false;
  loadingSpettacoli = false;
  erroreFilm: string | null = null;
  erroreSpettacoli: string | null = null;


  // Modale di acquisto biglietto
  modaleAperta = false;
  spettacoloInAcquisto: ResponseSpettacoloDTO | null = null;
  erroreAcquisto: string | null = null;
  messaggioAcquisto: string | null = null;

  constructor(
      private route: ActivatedRoute,

      private authService: AuthService,
      private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    const dati = this.route.snapshot.data['dati'] as DettaglioFilmResolverData;
    this.film = dati.film;
    this.spettacoli = dati.spettacoli ?? [];
  }

  durataLabel(minuti: number): string {
    const ore = Math.floor(minuti / 60);
    const restanti = minuti % 60;
    return ore > 0 ? `${ore}h ${restanti.toString().padStart(2, '0')}m` : `${restanti}m`;
  }

  generiLabel(film: ResponseFilmDTO): string {
    return film.nomeGeneri?.length ? film.nomeGeneri.join(' / ') : 'Genere non specificato';
  }

  orario(isoDateTime: string): string {
    const parti = isoDateTime.split('T');
    return parti.length > 1 ? parti[1].slice(0, 5) : isoDateTime.slice(0, 5);
  }

  dataLabel(data: string): string {
    if (!data) return 'Oggi';

    const [anno, mese, giorno] = data.split('-');
    if (!anno || !mese || !giorno) return data;

    return `${giorno}/${mese}/${anno}`;
  }

  isCliente(): boolean {
    return this.authService.isLoggedIn() && this.authService.getRuolo() === Ruolo.CLIENTE;
  }

  prenota(spettacolo: ResponseSpettacoloDTO): void {
    if (!this.isCliente()) {
      this.erroreAcquisto = 'Per prenotare devi effettuare il login con un account cliente.';
      this.messaggioAcquisto = null;
      return;
    }

    if (spettacolo.postiRimanenti === 0) {
      this.erroreAcquisto = 'Spettacolo esaurito.';
      this.messaggioAcquisto = null;
      return;
    }

    this.erroreAcquisto = null;
    this.messaggioAcquisto = null;
    this.spettacoloInAcquisto = spettacolo;
    this.modaleAperta = true;
  }

  chiudiModaleAcquisto(): void {
    this.modaleAperta = false;
    this.spettacoloInAcquisto = null;
  }

  onAcquistoConfermato(biglietti: ResponseBigliettoDTO[]): void {
    const quantita = biglietti.length;
    this.messaggioAcquisto = quantita === 1 ? 'Acquisto confermato.' : `Acquisto confermato per ${quantita} biglietti.`;
    this.erroreAcquisto = null;
    this.chiudiModaleAcquisto();
    this.confirmDialogService.notifySuccess(
      quantita === 1
        ? 'Il tuo biglietto è stato acquistato con successo.'
        : `I tuoi ${quantita} biglietti sono stati acquistati con successo.`
    ).subscribe();
  }


}
