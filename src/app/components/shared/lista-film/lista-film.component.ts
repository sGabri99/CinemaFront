import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { FilmService } from '../../../services/film.service';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';

@Component({
  selector: 'app-lista-film',
  imports: [CommonModule, FormsModule, RouterLink, SafeUrlPipe],
  templateUrl: './lista-film.component.html',
  standalone: true,
  styleUrl: './lista-film.component.css'
})
export class ListaFilmComponent implements OnInit {
  films: ResponseFilmDTO[] = [];
  ricerca = '';
  genereSelezionato = 'Tutti';
  loading = false;
  errore: string | null = null;

  // ID del film su cui l'utente ha CLICCATO il play (sblocca audio)
  filmPlayId: number | null = null;
  // ID del film su cui l'utente è in hover (mostra overlay play)
  filmHoverId: number | null = null;

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.caricaFilm();
  }

  get generi(): string[] {
    const generi = this.asArray(this.films).flatMap((film) => film.nomeGeneri ?? []);
    return ['Tutti', ...Array.from(new Set(generi))];
  }

  get filmFiltrati(): ResponseFilmDTO[] {
    const query = this.ricerca.trim().toLowerCase();

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

      return matchTesto && matchGenere;
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

  getEmbedUrl(url: string): string {
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    // autoplay=1 + mute=0: l'audio funziona perché l'utente ha cliccato esplicitamente
    return match
      ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`
      : '';
  }

  onMouseEnter(filmId: number): void {
    this.filmHoverId = filmId;
  }

  onMouseLeave(filmId: number): void {
    this.filmHoverId = null;
    // Se si esce dalla card, ferma anche il video se era in play
    if (this.filmPlayId === filmId) {
      this.filmPlayId = null;
    }
  }

  onPlayClick(event: Event, filmId: number): void {
    event.stopPropagation();
    this.filmPlayId = filmId;
  }

  private caricaFilm(): void {
    this.loading = true;
    this.errore = null;

    this.filmService.findAll().subscribe({
      next: (films) => {
        this.films = this.asArray(films);
        this.loading = false;
      },
      error: () => {
        this.films = [];
        this.errore = 'Impossibile caricare i film dal backend.';
        this.loading = false;
      }
    });
  }

  private asArray<T>(value: T[] | null | undefined): T[] {
    return Array.isArray(value) ? value : [];
  }
}
