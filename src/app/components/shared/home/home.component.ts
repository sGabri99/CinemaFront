import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { ResponseSpettacoloDTO } from '../../../dto/spettacolo/response/response-spettacolo-dto';

import {HomeResolverData} from "../../../app.resolver";

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  films: ResponseFilmDTO[] = [];
  spettacoli: ResponseSpettacoloDTO[] = [];
  adesso = new Date();

  loadingFilm = false;
  loadingSpettacoli = false;
  erroreFilm: string | null = null;
  erroreSpettacoli: string | null = null;
  private timerAggiornamento?: ReturnType<typeof setInterval>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const dati = this.route.snapshot.data['dati'] as HomeResolverData;
    this.films = dati.films ?? [];
    this.spettacoli = dati.spettacoli ?? [];

    this.timerAggiornamento = setInterval(() => {
      this.adesso = new Date();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.timerAggiornamento) {
      clearInterval(this.timerAggiornamento);
    }
  }

  get filmInEvidenza(): ResponseFilmDTO[] {
    return this.asArray(this.films).slice(0, 4);
  }

  get spettacoliOggi(): ResponseSpettacoloDTO[] {
    const oggi = this.dataLocaleOggi();
    return this.asArray(this.spettacoli)
      .filter(spettacolo => spettacolo.data === oggi)
      .sort((a, b) => this.timestampSpettacolo(a.oraInizio, a.data) - this.timestampSpettacolo(b.oraInizio, b.data));
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
    if (!isoDateTime) return '';
    const timePart = isoDateTime.includes('T') ? isoDateTime.split('T')[1] :
      isoDateTime.includes(' ') ? isoDateTime.split(' ')[1] : isoDateTime;
    return timePart.slice(0, 5);
  }

  fasciaOraria(spettacolo: ResponseSpettacoloDTO): string {
    return `${this.orario(spettacolo.oraInizio)} - ${this.orario(spettacolo.oraFine)}`;
  }

  spettacoloInCorso(spettacolo: ResponseSpettacoloDTO): boolean {
    const ora = this.adesso.getTime();
    const inizio = this.timestampSpettacolo(spettacolo.oraInizio, spettacolo.data);
    const fine = this.timestampSpettacolo(spettacolo.oraFine, spettacolo.data);
    return ora >= inizio && ora <= fine;
  }

  posterClass(index: number): string {
    return ['poster red', 'poster dark-red', 'poster gray', 'poster'][index % 4];
  }



  private dataLocaleOggi(): string {
    const anno = this.adesso.getFullYear();
    const mese = String(this.adesso.getMonth() + 1).padStart(2, '0');
    const giorno = String(this.adesso.getDate()).padStart(2, '0');
    return `${anno}-${mese}-${giorno}`;
  }

  private timestampSpettacolo(value: string, data: string): number {
    if (!value) return 0;
    const normalized = value.includes('T') || value.includes(' ') ? value.replace(' ', 'T') : `${data}T${value}`;
    return new Date(normalized).getTime();
  }

  private asArray<T>(value: T[] | null | undefined): T[] {
    return Array.isArray(value) ? value : [];
  }
}
