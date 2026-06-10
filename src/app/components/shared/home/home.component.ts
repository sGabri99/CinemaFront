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
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  films: ResponseFilmDTO[] = [];
  spettacoli: ResponseSpettacoloDTO[] = [];

  loadingFilm = false;
  loadingSpettacoli = false;
  erroreFilm: string | null = null;
  erroreSpettacoli: string | null = null;

  constructor(
    private filmService: FilmService,
    private spettacoloService: SpettacoloService
  ) {}

  ngOnInit(): void {
    this.caricaFilm();
    this.caricaSpettacoli();
  }

  get filmInEvidenza(): ResponseFilmDTO[] {
    return this.films.slice(0, 4);
  }

  get spettacoliOggi(): ResponseSpettacoloDTO[] {
    return this.spettacoli.slice(0, 4);
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

  private caricaFilm(): void {
    this.loadingFilm = true;
    this.erroreFilm = null;

    this.filmService.findAll().subscribe({
      next: (films) => {
        this.films = films;
        this.loadingFilm = false;
      },
      error: () => {
        this.films = [];
        this.erroreFilm = 'Impossibile caricare i film dal backend.';
        this.loadingFilm = false;
      }
    });
  }

  private caricaSpettacoli(): void {
    this.loadingSpettacoli = true;
    this.erroreSpettacoli = null;

    this.spettacoloService.findAll().subscribe({
      next: (spettacoli) => {
        this.spettacoli = spettacoli;
        this.loadingSpettacoli = false;
      },
      error: () => {
        this.spettacoli = [];
        this.erroreSpettacoli = 'Impossibile caricare gli spettacoli dal backend.';
        this.loadingSpettacoli = false;
      }
    });
  }
}
