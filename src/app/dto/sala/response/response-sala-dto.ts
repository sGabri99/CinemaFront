import {Tipo} from '../../../enums/tipo';

export interface ResponseSalaDTO {
   id:number;
   nome:string;
   numeroPos:number;
   tipo:Tipo;
   idSpettacoli:number[];
}
