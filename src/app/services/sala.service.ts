import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {InsertSalaDTO} from '../dto/sala/request/insert-sala-dto';
import {Observable} from 'rxjs';
import {ResponseSalaDTO} from '../dto/sala/response/response-sala-dto';
import {EditSalaDTO} from '../dto/sala/request/edit-sala-dto';
import {Tipo} from '../enums/tipo';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  insert(dto: InsertSalaDTO): Observable<ResponseSalaDTO> {
    return this.http.post<ResponseSalaDTO>(`${this.BASE_URL}/staff/sala`, dto);
  }


  findAll(): Observable<ResponseSalaDTO[]> {
    return this.http.get<ResponseSalaDTO[]>(`${this.BASE_URL}/sala`);
  }


  findById(id: number): Observable<ResponseSalaDTO> {
    return this.http.get<ResponseSalaDTO>(`${this.BASE_URL}/sala/${id}`);
  }


  findByTipo(tipo: Tipo): Observable<ResponseSalaDTO[]> {
    return this.http.get<ResponseSalaDTO[]>(
      `${this.BASE_URL}/sala/tipo/${tipo}`
    );
  }


  findByNome(nome: string): Observable<ResponseSalaDTO> {
    return this.http.get<ResponseSalaDTO>(`${this.BASE_URL}/sala/nome/${nome}`);
  }


  editById(id: number, dto: EditSalaDTO): Observable<ResponseSalaDTO> {
    return this.http.patch<ResponseSalaDTO>(
      `${this.BASE_URL}/staff/sala/${id}`,
      dto
    );
  }


  removeById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/staff/sala/${id}`);
  }
}
