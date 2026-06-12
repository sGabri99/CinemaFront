import {Tipo} from '../../../enums/tipo';

export interface ResponseSalaDTO {
   id:number;
   nome:string;
   numeroPosti:number;
   tipo:Tipo;
   idSpettacoli:number[];
}
