import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { FilmService } from '../../../services/film.service';

@Component({
  selector: 'app-lista-film',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-film.component.html',
  standalone: true,
  styleUrl: './lista-film.component.css'
})
export class ListaFilmComponent implements OnInit {
  films: ResponseFilmDTO[] = [];
  ricerca = '';
  genereSelezionato = 'Tutti';

  readonly filmFallback: ResponseFilmDTO[] = [
    { id: 1, titolo: 'Notte Rossa', descrizione: 'Un thriller d azione ambientato tra luci al neon e misteri da risolvere.', durata: 125, attori: 'Marta Leone, Luca Ferri', urlLocandina: '', nomeGeneri: ['Azione', 'Thriller'] },
    { id: 2, titolo: 'Oltre le Stelle', descrizione: 'Un viaggio fantascientifico tra spazio profondo, memoria e nuove rotte.', durata: 118, attori: 'Elena Riva, Paolo Neri', urlLocandina: '', nomeGeneri: ['Fantascienza'] },
    { id: 3, titolo: 'Ultimo Ciak', descrizione: 'Un set cinematografico diventa il centro di una indagine pericolosa.', durata: 107, attori: 'Giulia Serra, Andrea Costa', urlLocandina: '', nomeGeneri: ['Thriller'] },
    { id: 4, titolo: 'La Sala 7', descrizione: 'Una sala riaperta dopo anni ospita uno spettacolo non previsto.', durata: 102, attori: 'Sara Conti, Marco Belli', urlLocandina: '', nomeGeneri: ['Horror'] },
    { id: 5, titolo: 'Estate in Pellicola', descrizione: 'Una commedia luminosa su amicizia, famiglia e seconde possibilita.', durata: 96, attori: 'Chiara Galli, Davide Rosi', urlLocandina: '', nomeGeneri: ['Commedia'] },
    { id: 6, titolo: 'Linea d Ombra', descrizione: 'Un dramma teso e intimo dove ogni scelta cambia il finale.', durata: 132, attori: 'Francesco Vitali, Anna Greco', urlLocandina: '', nomeGeneri: ['Drammatico'] }
  ];

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.filmService.findAll().subscribe({
      next: (films) => this.films = films,
      error: () => this.films = []
    });
  }

  get sorgenteFilm(): ResponseFilmDTO[] {
    return this.films.length ? this.films : this.filmFallback;
  }

  get generi(): string[] {
    const generi = this.sorgenteFilm.flatMap((film) => film.nomeGeneri ?? []);
    return ['Tutti', ...Array.from(new Set(generi))];
  }

  get filmFiltrati(): ResponseFilmDTO[] {
    const query = this.ricerca.trim().toLowerCase();

    return this.sorgenteFilm.filter((film) => {
      const matchTesto = !query ||
        film.titolo.toLowerCase().includes(query) ||
        film.descrizione.toLowerCase().includes(query) ||
        film.attori.toLowerCase().includes(query);

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
    return film.nomeGeneri?.length ? film.nomeGeneri.join(' / ') : 'Cinema';
  }

  posterClass(index: number): string {
    return ['poster red', 'poster dark-red', 'poster gray', 'poster'][index % 4];
  }
}
