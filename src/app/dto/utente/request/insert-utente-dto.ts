export interface InsertUtenteDTO {
  nome: string;
  cognome: string;
  email: string;
  password?: string;
  confermaPassword?: string;
  ruolo?: string;
  telefono?: string;
}
