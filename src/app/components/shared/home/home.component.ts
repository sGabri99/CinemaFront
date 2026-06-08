import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { ResponseSpettacoloDTO } from '../../../dto/spettacolo/response/response-spettacolo-dto';
import { FilmService } from '../../../services/film.service';
import { SpettacoloService } from '../../../services/spettacolo.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  films: ResponseFilmDTO[] = [];
  spettacoli: ResponseSpettacoloDTO[] = [];

  readonly filmFallback: ResponseFilmDTO[] = [
    { id: 1, titolo: 'Notte Rossa', descrizione: 'Un thriller d azione tra luci al neon, inseguimenti e misteri da risolvere.', durata: 125, attori: 'Marta Leone, Luca Ferri', urlLocandina: '', nomeGeneri: ['Azione', 'Thriller'] },
    { id: 2, titolo: 'Oltre le Stelle', descrizione: 'Un viaggio fantascientifico tra memoria, spazio profondo e nuove rotte.', durata: 118, attori: 'Elena Riva, Paolo Neri', urlLocandina: '', nomeGeneri: ['Fantascienza'] },
    { id: 3, titolo: 'Ultimo Ciak', descrizione: 'Un set cinematografico diventa il centro di una indagine pericolosa.', durata: 107, attori: 'Giulia Serra, Andrea Costa', urlLocandina: '', nomeGeneri: ['Thriller'] },
    { id: 4, titolo: 'La Sala 7', descrizione: 'Una sala riaperta dopo anni ospita uno spettacolo non previsto.', durata: 102, attori: 'Sara Conti, Marco Belli', urlLocandina: '', nomeGeneri: ['Horror'] }
  ];

  readonly spettacoliFallback: ResponseSpettacoloDTO[] = [
    { id: 1, data: '2026-06-08', oraInizio: '2026-06-08T16:30:00', oraFine: '2026-06-08T18:30:00', postiRimanenti: 84, idBiglietti: [], nomeSala: 'Sala 1', nomeFilm: 'Notte Rossa' },
    { id: 2, data: '2026-06-08', oraInizio: '2026-06-08T19:15:00', oraFine: '2026-06-08T21:15:00', postiRimanenti: 42, idBiglietti: [], nomeSala: 'Sala 1', nomeFilm: 'Notte Rossa' },
    { id: 3, data: '2026-06-08', oraInizio: '2026-06-08T21:20:00', oraFine: '2026-06-08T23:10:00', postiRimanenti: 56, idBiglietti: [], nomeSala: 'Sala 2', nomeFilm: 'Oltre le Stelle' },
    { id: 4, data: '2026-06-08', oraInizio: '2026-06-08T23:15:00', oraFine: '2026-06-09T00:50:00', postiRimanenti: 21, idBiglietti: [], nomeSala: 'Sala 7', nomeFilm: 'La Sala 7' }
  ];

  constructor(
    private filmService: FilmService,
    private spettacoloService: SpettacoloService
  ) {}

  ngOnInit(): void {
    this.filmService.findAll().subscribe({
      next: (films) => this.films = films,
      error: () => this.films = []
    });

    this.spettacoloService.findAll().subscribe({
      next: (spettacoli) => this.spettacoli = spettacoli,
      error: () => this.spettacoli = []
    });
  }

  get filmInEvidenza(): ResponseFilmDTO[] {
    return (this.films.length ? this.films : this.filmFallback).slice(0, 4);
  }

  get spettacoliOggi(): ResponseSpettacoloDTO[] {
    return (this.spettacoli.length ? this.spettacoli : this.spettacoliFallback).slice(0, 4);
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

  posterClass(index: number): string {
    return ['poster red', 'poster dark-red', 'poster gray', 'poster'][index % 4];
  }
}
