import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {InsertSpettacoloDTO} from '../dto/spettacolo/request/insert-spettacolo-dto';
import {Observable} from 'rxjs';
import {ResponseSpettacoloDTO} from '../dto/spettacolo/response/response-spettacolo-dto';
import {EditSpettacoloDTO} from '../dto/spettacolo/request/edit-spettacolo-dto';

@Injectable({
  providedIn: 'root'
})
export class SpettacoloService {
  private BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  insert(dto: InsertSpettacoloDTO): Observable<ResponseSpettacoloDTO> {
    return this.http.post<ResponseSpettacoloDTO>(
      `${this.BASE_URL}/staff/spettacolo`,
      dto
    );
  }


  findAll(): Observable<ResponseSpettacoloDTO[]> {
    return this.http.get<ResponseSpettacoloDTO[]>(
      `${this.BASE_URL}/spettacolo`
    );
  }


  findByData(data: string): Observable<ResponseSpettacoloDTO[]> {
    return this.http.get<ResponseSpettacoloDTO[]>(
      `${this.BASE_URL}/spettacolo/${data}`
    );
  }


  findByIdFilm(idFilm: number): Observable<ResponseSpettacoloDTO[]> {
    return this.http.get<ResponseSpettacoloDTO[]>(
      `${this.BASE_URL}/spettacolo/film/${idFilm}`
    );
  }


  editById(id: number, dto: EditSpettacoloDTO): Observable<ResponseSpettacoloDTO> {
    return this.http.patch<ResponseSpettacoloDTO>(
      `${this.BASE_URL}/staff/spettacolo/${id}`,
      dto
    );
  }


  removeById(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.BASE_URL}/staff/spettacolo/${id}`
    );
  }

  getFatturatoSpettacoli(): Observable<Record<number, number>> {
    return this.http.get<Record<number, number>>(
      `${this.BASE_URL}/admin/spettacolo/fatturato`
    );
  }
}
