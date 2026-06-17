export interface ResponseSpettacoloDTO {
  id: number;
  idFilm?: number;
  data: string;
  oraInizio: string;
  oraFine: string;
  postiRimanenti: number;
  idBiglietti: number[];
  nomeSala: string;
  nomeFilm: string;
  fatturato?: number;
}
