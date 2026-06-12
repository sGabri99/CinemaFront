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
      private filmService: FilmService,
      private spettacoloService: SpettacoloService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.caricaFilm(id);
    this.caricaSpettacoli(id);
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

  onAcquistoConfermato(): void {
    this.messaggioAcquisto = 'Acquisto confermato.';
    this.erroreAcquisto = null;
    this.chiudiModaleAcquisto();
  }

  private caricaFilm(id: number): void {
    if (!id) {
      this.erroreFilm = 'Film non valido.';
      return;
    }

    this.loadingFilm = true;
    this.erroreFilm = null;

    this.filmService.findById(id).subscribe({
      next: (film) => {
        this.film = film;
        this.loadingFilm = false;
      },
      error: () => {
        this.film = undefined;
        this.erroreFilm = 'Impossibile caricare il film dal backend.';
        this.loadingFilm = false;
      }
    });
  }

  private caricaSpettacoli(id: number): void {
    if (!id) {
      return;
    }

    this.loadingSpettacoli = true;
    this.erroreSpettacoli = null;

    this.spettacoloService.findByIdFilm(id).subscribe({
      next: (spettacoli) => {
        this.spettacoli = spettacoli.filter(s => this.isFuturo(s));
        this.loadingSpettacoli = false;
      },
      error: () => {
        this.spettacoli = [];
        this.erroreSpettacoli = 'Impossibile caricare gli spettacoli del film.';
        this.loadingSpettacoli = false;
      }
    });
  }

  private isFuturo(spettacolo: ResponseSpettacoloDTO): boolean {
    const timePart = spettacolo.oraInizio.includes('T')
        ? spettacolo.oraInizio.split('T')[1]
        : spettacolo.oraInizio.includes(' ')
            ? spettacolo.oraInizio.split(' ')[1]
            : spettacolo.oraInizio;
    const ora = timePart?.substring(0, 5) ?? '00:00';
    const dataOra = new Date(`${spettacolo.data}T${ora}:00`);
    return dataOra > new Date();
  }
}
