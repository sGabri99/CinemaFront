import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { FilmService } from '../../../services/film.service';
import { SpettacoloService } from '../../../services/spettacolo.service';
import { SalaService } from '../../../services/sala.service';

import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { ResponseSpettacoloDTO } from '../../../dto/spettacolo/response/response-spettacolo-dto';
import { ResponseSalaDTO } from '../../../dto/sala/response/response-sala-dto';
import {Tipo} from "../../../enums/tipo";

export interface StatFilm {
  film: ResponseFilmDTO;
  totaleSpettacoli: number;
  totaleBiglietti: number;
  postiTotali: number;
  percentualeOccupazione: number;
  fatturato: number;
}

export interface StatSpettacolo {
  spettacolo: ResponseSpettacoloDTO;
  totaleBiglietti: number;
  capienza: number;
  percentualeOccupazione: number;
  fatturato: number;
}

export interface StatSala {
  sala: ResponseSalaDTO;
  totaleSpettacoli: number;
  totaleBiglietti: number;
  percentualeUtilizzo: number;
  fatturato: number;
}

@Component({
  selector: 'app-statistiche',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistiche.component.html',
  styleUrl: './statistiche.component.css'
})
export class StatisticheComponent implements OnInit {
  loading = true;
  errore: string | null = null;



  // Dati grezzi
  films: ResponseFilmDTO[] = [];
  spettacoli: ResponseSpettacoloDTO[] = [];
  sale: ResponseSalaDTO[] = [];

  totaleSpettacoli = 0;
  totaleBigliettiVenduti = 0;
  fatturatoTotale = 0;
  spettacoliPassati = 0;
  spettacoliFuturi = 0;
  filmInCatalogo = 0;
  mediaOccupazioneGlobale = 0;

  statPerFilm: StatFilm[] = [];
  statPerSpettacolo: StatSpettacolo[] = [];
  statPerSala: StatSala[] = [];

  vistaAttiva: 'film' | 'spettacoli' | 'sale' = 'film';
  ordinamentoFilm: 'biglietti' | 'occupazione' | 'spettacoli' | 'fatturato' = 'fatturato';
  ordinamentoSpettacoli: 'biglietti' | 'occupazione' | 'data' | 'fatturato' = 'fatturato';
  filtroData = '';
  filtroFilmId: number | null = null;

  constructor(
      private filmService: FilmService,
      private spettacoloService: SpettacoloService,
      private salaService: SalaService
  ) {}

  ngOnInit(): void {
    forkJoin({
      films: this.filmService.findAll(),
      spettacoli: this.spettacoloService.findAll(),
      sale: this.salaService.findAll(),
      fatturati: this.spettacoloService.getFatturatoSpettacoli()
    }).subscribe({
      next: ({ films, spettacoli, sale, fatturati }) => {
        this.films = films;
        this.sale = sale;
        this.spettacoli = spettacoli.map(s => ({
          ...s,
          fatturato: fatturati[s.id] ?? 0
        }));
        this.ricalcolaTutto();
        this.loading = false;
      },
      error: () => {
        this.errore = 'Impossibile caricare i dati. Verifica che il backend sia raggiungibile.';
        this.loading = false;
      }
    });
  }

  ricalcolaTutto(): void {
    this.calcolaKpi();
    this.calcolaStatFilm();
    this.calcolaStatSpettacoli();
    this.calcolaStatSale();
  }


  private calcolaKpi(): void {
    const oggi = new Date();
    this.totaleSpettacoli = this.spettacoli.length;
    this.filmInCatalogo = this.films.length;

    this.totaleBigliettiVenduti = this.spettacoli.reduce(
        (acc, s) => acc + (s.idBiglietti?.length ?? 0), 0
    );


    this.fatturatoTotale = this.spettacoli.reduce((acc, s) => {
      return acc + (s.fatturato ?? 0);
    }, 0);

    this.spettacoliPassati = this.spettacoli.filter(
        s => new Date(s.data) < oggi
    ).length;
    this.spettacoliFuturi = this.totaleSpettacoli - this.spettacoliPassati;

    const occupazioni = this.spettacoli.map(s => {
      const sala = this.sale.find(sa => sa.nome === s.nomeSala);
      if (!sala || sala.numeroPosti === 0) return 0;
      return ((s.idBiglietti?.length ?? 0) / sala.numeroPosti) * 100;
    });

    this.mediaOccupazioneGlobale = occupazioni.length
        ? occupazioni.reduce((a, b) => a + b, 0) / occupazioni.length
        : 0;
  }

  private calcolaStatFilm(): void {
    this.statPerFilm = this.films.map(film => {
      const spettacoliFilm = this.spettacoli.filter(
          s => s.idFilm === film.id || s.nomeFilm === film.titolo
      );

      const totaleBiglietti = spettacoliFilm.reduce((acc, s) => acc + (s.idBiglietti?.length ?? 0), 0);
      const postiTotali = spettacoliFilm.reduce((acc, s) => {
        const sala = this.sale.find(sa => sa.nome === s.nomeSala);
        return acc + (sala?.numeroPosti ?? 0);
      }, 0);

      // Sommiamo il fatturato specifico per ogni spettacolo
      const fatturatoTotale = spettacoliFilm.reduce((acc, s) => {
        return acc + (s.fatturato ?? 0);
      }, 0);

      return {
        film,
        totaleSpettacoli: spettacoliFilm.length,
        totaleBiglietti,
        postiTotali,
        percentualeOccupazione: postiTotali > 0 ? (totaleBiglietti / postiTotali) * 100 : 0,
        fatturato: fatturatoTotale
      };
    });
    this.ordinaFilm();
  }

  private calcolaStatSpettacoli(): void {
    this.statPerSpettacolo = this.spettacoli.map(s => {
      const sala = this.sale.find(sa => sa.nome === s.nomeSala);
      const capienza = sala?.numeroPosti ?? 0;
      const venduti = s.idBiglietti?.length ?? 0;
      return {
        spettacolo: s,
        totaleBiglietti: venduti,
        capienza,
        percentualeOccupazione: capienza > 0 ? (venduti / capienza) * 100 : 0,
        fatturato: s.fatturato ?? 0
      };
    });
    this.ordinaSpettacoli();
  }

  private calcolaStatSale(): void {
    this.statPerSala = this.sale.map(sala => {
      const spettacoliSala = this.spettacoli.filter(s => s.nomeSala === sala.nome);

      const totaleBiglietti = spettacoliSala.reduce(
          (acc, s) => acc + (s.idBiglietti?.length ?? 0), 0
      );

      // Calcoliamo il fatturato sommano i prezzi specifici per ogni spettacolo
      const fatturatoTotale = spettacoliSala.reduce((acc, s) => {
        return acc + (s.fatturato ?? 0);
      }, 0);

      const postiTotali = spettacoliSala.length * sala.numeroPosti;

      return {
        sala,
        totaleSpettacoli: spettacoliSala.length,
        totaleBiglietti,
        percentualeUtilizzo: postiTotali > 0 ? (totaleBiglietti / postiTotali) * 100 : 0,
        fatturato: fatturatoTotale
      };
    }).sort((a, b) => b.fatturato - a.fatturato);
  }

  // ── Ordinamenti e filtri ─────────────────────────────────────
  ordinaFilm(): void {
    this.statPerFilm = [...this.statPerFilm].sort((a, b) => {
      if (this.ordinamentoFilm === 'fatturato')    return b.fatturato - a.fatturato;
      if (this.ordinamentoFilm === 'biglietti')    return b.totaleBiglietti - a.totaleBiglietti;
      if (this.ordinamentoFilm === 'occupazione')  return b.percentualeOccupazione - a.percentualeOccupazione;
      return b.totaleSpettacoli - a.totaleSpettacoli;
    });
  }

  ordinaSpettacoli(): void {
    this.statPerSpettacolo = [...this.statPerSpettacolo].sort((a, b) => {
      if (this.ordinamentoSpettacoli === 'fatturato')   return b.fatturato - a.fatturato;
      if (this.ordinamentoSpettacoli === 'biglietti')   return b.totaleBiglietti - a.totaleBiglietti;
      if (this.ordinamentoSpettacoli === 'occupazione') return b.percentualeOccupazione - a.percentualeOccupazione;
      return a.spettacolo.data.localeCompare(b.spettacolo.data);
    });
  }

  get spettacoliFiltrati(): StatSpettacolo[] {
    return this.statPerSpettacolo.filter(s => {
      const matchData = !this.filtroData || s.spettacolo.data === this.filtroData;
      const matchFilm = !this.filtroFilmId ||
          s.spettacolo.idFilm === this.filtroFilmId ||
          s.spettacolo.nomeFilm === this.films.find(f => f.id === this.filtroFilmId)?.titolo;
      return matchData && matchFilm;
    });
  }

  get filmTopTre(): StatFilm[] {
    return [...this.statPerFilm]
        .sort((a, b) => b.fatturato - a.fatturato)
        .slice(0, 3);
  }

  get fatturatoFiltrato(): number {
    return this.spettacoliFiltrati.reduce((acc, s) => acc + s.fatturato, 0);
  }

  // ── Utility template ─────────────────────────────────────────
  formatOrario(ora: string): string {
    if (!ora) return '';
    const part = ora.includes('T') ? ora.split('T')[1] : ora.includes(' ') ? ora.split(' ')[1] : ora;
    return part?.slice(0, 5) ?? '';
  }

  formatData(data: string): string {
    if (!data) return '';
    const [y, m, d] = data.split('-');
    return `${d}/${m}/${y}`;
  }

  formatEuro(valore: number): string {
    return valore.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
  }

  barraLarghezza(perc: number): string {
    return `${Math.min(Math.round(perc), 100)}%`;
  }

  coloreOccupazione(perc: number): string {
    if (perc >= 80) return 'var(--primary)';
    if (perc >= 50) return '#f4a261';
    return '#2a9d8f';
  }

  trendLabel(perc: number): string {
    if (perc >= 80) return 'Sold out';
    if (perc >= 50) return 'Buono';
    return 'Basso';
  }

  resetFiltriSpettacoli(): void {
    this.filtroData = '';
    this.filtroFilmId = null;
  }
}