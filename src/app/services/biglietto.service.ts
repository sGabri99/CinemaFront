import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InsertBigliettoDTO} from '../dto/biglietto/request/insert-biglietto-dto';
import {ResponseBigliettoDTO} from '../dto/biglietto/response/response-biglietto-dto';

@Injectable({
  providedIn: 'root'
})
export class BigliettoService {
  private readonly BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}


  insert(dto: InsertBigliettoDTO): Observable<ResponseBigliettoDTO[]> {
    return this.http.post<ResponseBigliettoDTO[]>(
      `${this.BASE_URL}/cliente/biglietto`,
      dto
    );
  }


  findByIdUtente(idUtente: number): Observable<ResponseBigliettoDTO[]> {
    return this.http.get<ResponseBigliettoDTO[]>(
      `${this.BASE_URL}/staff/biglietto/utente/${idUtente}`
    );
  }


  findByIdSpettacolo(idSpettacolo: number): Observable<ResponseBigliettoDTO[]> {
    return this.http.get<ResponseBigliettoDTO[]>(
      `${this.BASE_URL}/staff/biglietto/spettacolo/${idSpettacolo}`
    );
  }


  removeById(id: number, email: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/cliente/biglietto/${id}`, {
      body: email,
    });
  }
}
