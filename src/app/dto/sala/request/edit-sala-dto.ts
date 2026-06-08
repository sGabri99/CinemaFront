import {Tipo} from '../../../enums/tipo';

export interface EditSalaDTO {
  nome: string;
  numeroPosti:number;
  tipo:Tipo;
  idSpettacoli:number[];
}
