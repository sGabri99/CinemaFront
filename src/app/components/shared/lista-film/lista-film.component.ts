import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { ResponseSpettacoloDTO } from '../../../dto/spettacolo/response/response-spettacolo-dto';
import { FilmService } from '../../../services/film.service';
import { SpettacoloService } from '../../../services/spettacolo.service';

@Component({
  selector: 'app-lista-film',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-film.component.html',
  standalone: true,
  styleUrl: './lista-film.component.css'
})
export class ListaFilmComponent implements OnInit {
  films: ResponseFilmDTO[] = [];
  spettacoliFuturi: ResponseSpettacoloDTO[] = [];
  ricerca = '';
  genereSelezionato = 'Tutti';
  loading = false;
  errore: string | null = null;

  constructor(private filmService: FilmService, private spettacoloService: SpettacoloService) {}

  ngOnInit(): void {
    this.caricaFilm();
  }

  get generi(): string[] {
    const generi = this.asArray(this.films).flatMap((film) => film.nomeGeneri ?? []);
    return ['Tutti', ...Array.from(new Set(generi))];
  }

  get filmFiltrati(): ResponseFilmDTO[] {
    const query = this.ricerca.trim().toLowerCase();
    // ID dei film che hanno almeno uno spettacolo futuro
    const idFilmConSpettacoli = new Set(this.asArray(this.spettacoliFuturi).map(s => s.idFilm));

    return this.asArray(this.films).filter((film) => {
      const titolo = (film.titolo ?? '').toLowerCase();
      const descrizione = (film.descrizione ?? '').toLowerCase();
      const attori = (film.attori ?? '').toLowerCase();

      const matchTesto = !query ||
          titolo.includes(query) ||
          descrizione.includes(query) ||
          attori.includes(query);

      const matchGenere = this.genereSelezionato === 'Tutti' ||
          film.nomeGeneri?.includes(this.genereSelezionato);

      const haSpettacoloFuturo = idFilmConSpettacoli.has(film.id);

      return matchTesto && matchGenere && haSpettacoloFuturo;
    });
  }

  durataLabel(minuti: number): string {
    const ore = Math.floor(minuti / 60);
    const restanti = minuti % 60;
    return ore > 0 ? `${ore}h ${restanti.toString().padStart(2, '0')}m` : `${restanti}m`;
  }

  generiLabel(film: ResponseFilmDTO): string {
    return film.nomeGeneri?.length ? film.nomeGeneri.join(' / ') : 'Genere non specificato';
  }

  posterClass(index: number): string {
    return ['poster red', 'poster dark-red', 'poster gray', 'poster'][index % 4];
  }

  private caricaFilm(): void {
    this.loading = true;
    this.errore = null;

    forkJoin({
      films: this.filmService.findAll(),
      spettacoli: this.spettacoloService.findAll()
    }).subscribe({
      next: ({ films, spettacoli }) => {
        this.films = this.asArray(films);
        this.spettacoliFuturi = this.asArray(spettacoli).filter(s => this.isFuturo(s));
        this.loading = false;
      },
      error: () => {
        this.films = [];
        this.errore = 'Impossibile caricare i film dal backend.';
        this.loading = false;
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

  private asArray<T>(value: T[] | null | undefined): T[] {
    return Array.isArray(value) ? value : [];
  }
}
