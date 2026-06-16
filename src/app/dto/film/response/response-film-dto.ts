export interface ResponseFilmDTO {
  id: number;
  titolo: string;
  descrizione: string;
  durata: number;
  attori: string;
  urlLocandina: string;
  nomeGeneri: string[];
  urlTrailer?: string;
}
