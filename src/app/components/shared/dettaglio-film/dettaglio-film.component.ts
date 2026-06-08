import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { ResponseSpettacoloDTO } from '../../../dto/spettacolo/response/response-spettacolo-dto';
import { FilmService } from '../../../services/film.service';
import { SpettacoloService } from '../../../services/spettacolo.service';

@Component({
  selector: 'app-dettaglio-film',
  imports: [CommonModule, RouterLink],
  templateUrl: './dettaglio-film.component.html',
  styleUrl: './dettaglio-film.component.css'
})
export class DettaglioFilmComponent implements OnInit {
  film?: ResponseFilmDTO;
  spettacoli: ResponseSpettacoloDTO[] = [];

  readonly filmFallback: ResponseFilmDTO = {
    id: 1,
    titolo: 'Notte Rossa',
    descrizione: 'Un thriller d azione ambientato tra luci al neon, inseguimenti e misteri da risolvere prima dell alba.',
    durata: 125,
    attori: 'Marta Leone, Luca Ferri',
    urlLocandina: '',
    nomeGeneri: ['Azione', 'Thriller']
  };

  readonly spettacoliFallback: ResponseSpettacoloDTO[] = [
    { id: 1, data: '2026-06-08', oraInizio: '2026-06-08T16:30:00', oraFine: '2026-06-08T18:30:00', postiRimanenti: 84, idBiglietti: [], nomeSala: 'Sala 1', nomeFilm: 'Notte Rossa' },
    { id: 2, data: '2026-06-08', oraInizio: '2026-06-08T19:15:00', oraFine: '2026-06-08T21:15:00', postiRimanenti: 42, idBiglietti: [], nomeSala: 'Sala 1', nomeFilm: 'Notte Rossa' },
    { id: 3, data: '2026-06-09', oraInizio: '2026-06-09T22:00:00', oraFine: '2026-06-10T00:00:00', postiRimanenti: 36, idBiglietti: [], nomeSala: 'Sala 3', nomeFilm: 'Notte Rossa' }
  ];

  constructor(
    private route: ActivatedRoute,
    private filmService: FilmService,
    private spettacoloService: SpettacoloService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.caricaFilm(id);
    this.caricaSpettacoli(id);
  }

  get filmCorrente(): ResponseFilmDTO {
    return this.film ?? this.filmFallback;
  }

  get spettacoliVisibili(): ResponseSpettacoloDTO[] {
    return this.spettacoli.length ? this.spettacoli : this.spettacoliFallback;
  }

  durataLabel(minuti: number): string {
    const ore = Math.floor(minuti / 60);
    const restanti = minuti % 60;
    return ore > 0 ? `${ore}h ${restanti.toString().padStart(2, '0')}m` : `${restanti}m`;
  }

  generiLabel(film: ResponseFilmDTO): string {
    return film.nomeGeneri?.length ? film.nomeGeneri.join(' / ') : 'Cinema';
  }

  orario(isoDateTime: string): string {
    const parti = isoDateTime.split('T');
    return parti.length > 1 ? parti[1].slice(0, 5) : isoDateTime.slice(0, 5);
  }

  dataLabel(data: string): string {
    return data || 'Oggi';
  }

  private caricaFilm(id: number): void {
    if (!id) {
      return;
    }

    this.filmService.findById(id).subscribe({
      next: (film) => this.film = film,
      error: () => this.film = undefined
    });
  }

  private caricaSpettacoli(id: number): void {
    if (!id) {
      return;
    }

    this.spettacoloService.findByIdFilm(id).subscribe({
      next: (spettacoli) => this.spettacoli = spettacoli,
      error: () => this.spettacoli = []
    });
  }
}
