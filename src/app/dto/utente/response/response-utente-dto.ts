export interface ResponseUtenteDto {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  ruolo: string;
  token?: string; // Se il backend restituisce il jwt alla registrazione/creazione
}