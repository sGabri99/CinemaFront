export interface InsertUtenteDto {
  nome: string;
  cognome: string;
  email: string;
  ruolo: string; // Qui passerai 'STAFF' o 'SUPERADMIN'
  telefono?: string;
  password?: string;
  confermaPassword?: string;
}
