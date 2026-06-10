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
  loadingFilm = false;
  loadingSpettacoli = false;
  erroreFilm: string | null = null;
  erroreSpettacoli: string | null = null;

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
        this.spettacoli = spettacoli;
        this.loadingSpettacoli = false;
      },
      error: () => {
        this.spettacoli = [];
        this.erroreSpettacoli = 'Impossibile caricare gli spettacoli del film.';
        this.loadingSpettacoli = false;
      }
    });
  }
}
