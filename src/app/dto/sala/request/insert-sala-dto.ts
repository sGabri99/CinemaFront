import {Tipo} from '../../../enums/tipo';

export interface InsertSalaDTO {
    nome:string;
    numeroPos:number;
    tipo:Tipo;
}
