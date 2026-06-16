import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map } from 'rxjs';

import { FilmService } from './services/film.service';
import { GenereService } from './services/genere.service';
import { SpettacoloService } from './services/spettacolo.service';
import { BigliettoService } from './services/biglietto.service';

import { ResponseFilmDTO } from './dto/film/response/response-film-dto';
import { ResponseGenereDTO } from './dto/genere/response/response-genere-dto';
import { ResponseSpettacoloDTO } from './dto/spettacolo/response/response-spettacolo-dto';
import { ResponseBigliettoDTO } from './dto/biglietto/response/response-biglietto-dto';

// lista-film → carica tutti i film

export const filmListResolver: ResolveFn<ResponseFilmDTO[]> = () => {
  return inject(FilmService).findAll();
};

// dettaglio-film/:id → carica film + spettacoli futuri per quel film

export interface DettaglioFilmResolverData {
  film: ResponseFilmDTO;
  spettacoli: ResponseSpettacoloDTO[];
}

export const dettaglioFilmResolver: ResolveFn<DettaglioFilmResolverData> = (route) => {
  const id = Number(route.paramMap.get('id'));
  const filmService = inject(FilmService);
  const spettacoloService = inject(SpettacoloService);

  return forkJoin({
    film: filmService.findById(id),
    spettacoli: spettacoloService.findByIdFilm(id).pipe(
        map(spettacoli => spettacoli.filter(s => isFuturo(s)))
    )
  });
};

// home → carica film + spettacoli di oggi

export interface HomeResolverData {
  films: ResponseFilmDTO[];
  spettacoli: ResponseSpettacoloDTO[];
}

export const homeResolver: ResolveFn<HomeResolverData> = () => {
  const oggi = dataLocaleOggi();
  return forkJoin({
    films: inject(FilmService).findAll(),
    spettacoli: inject(SpettacoloService).findByData(oggi)
  });
};

// lista-spettacoli → carica tutti gli spettacoli + tutti i film

export interface ListaSpettacoliResolverData {
  spettacoli: ResponseSpettacoloDTO[];
  films: ResponseFilmDTO[];
}

export const listaSpettacoliResolver: ResolveFn<ListaSpettacoliResolverData> = () => {
  return forkJoin({
    spettacoli: inject(SpettacoloService).findAll(),
    films: inject(FilmService).findAll()
  });
};


// gestione-film → carica tutti i film (staff)

export const gestioneFilmResolver: ResolveFn<ResponseFilmDTO[]> = () => {
  return inject(FilmService).findAll();
};


// gestione-generi → carica tutti i generi (staff)

export const gestioneGeneriResolver: ResolveFn<ResponseGenereDTO[]> = () => {
  return inject(GenereService).findAll();
};

// inserisci-film → carica i generi disponibili (staff)

export const inserisciFilmResolver: ResolveFn<ResponseGenereDTO[]> = () => {
  return inject(GenereService).findAll();
};


// gestione-spettacoli → carica film + sale (staff)

import { SalaService } from './services/sala.service';
import { ResponseSalaDTO } from './dto/sala/response/response-sala-dto';

export interface GestioneSpettacoliResolverData {
  films: ResponseFilmDTO[];
  sale: ResponseSalaDTO[];
  spettacoli: ResponseSpettacoloDTO[];
}

export const gestioneSpettacoliResolver: ResolveFn<GestioneSpettacoliResolverData> = () => {
  return forkJoin({
    films: inject(FilmService).findAll(),
    sale: inject(SalaService).findAll(),
    spettacoli: inject(SpettacoloService).findAll()
  });
};


// i-miei-biglietti → carica biglietti cliente + spettacoli

export interface IMieiBigliettiResolverData {
  biglietti: ResponseBigliettoDTO[];
  spettacoli: ResponseSpettacoloDTO[];
}

export const iMieiBigliettiResolver: ResolveFn<IMieiBigliettiResolverData> = () => {
  return forkJoin({
    biglietti: inject(BigliettoService).clientebiglietti(),
    spettacoli: inject(SpettacoloService).findAll()
  });
};


// Utility condivise

function isFuturo(spettacolo: ResponseSpettacoloDTO): boolean {
  const timePart = spettacolo.oraInizio.includes('T')
      ? spettacolo.oraInizio.split('T')[1]
      : spettacolo.oraInizio.includes(' ')
          ? spettacolo.oraInizio.split(' ')[1]
          : spettacolo.oraInizio;
  const ora = timePart?.substring(0, 5) ?? '00:00';
  return new Date(`${spettacolo.data}T${ora}:00`) > new Date();
}

function dataLocaleOggi(): string {
  const oggi = new Date();
  const anno = oggi.getFullYear();
  const mese = String(oggi.getMonth() + 1).padStart(2, '0');
  const giorno = String(oggi.getDate()).padStart(2, '0');
  return `${anno}-${mese}-${giorno}`;
}