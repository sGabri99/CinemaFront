import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {InsertGenereDTO} from '../dto/genere/request/insert-genere-dto';
import {Observable} from 'rxjs';
import {ResponseGenereDTO} from '../dto/genere/response/response-genere-dto';
import {EditGenereDTO} from '../dto/genere/request/edit-genere-dto';

@Injectable({
  providedIn: 'root'
})
export class GenereService {
  private BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}


  insert(dto: InsertGenereDTO): Observable<ResponseGenereDTO> {
    return this.http.post<ResponseGenereDTO>(
      `${this.BASE_URL}/staff/genere`,
      dto
    );
  }


  findAll(): Observable<ResponseGenereDTO[]> {
    return this.http.get<ResponseGenereDTO[]>(`${this.BASE_URL}/genere`);
  }


  findById(id: number): Observable<ResponseGenereDTO> {
    return this.http.get<ResponseGenereDTO>(`${this.BASE_URL}/genere/${id}`);
  }


  findByIdFilm(idFilm: number): Observable<ResponseGenereDTO[]> {
    return this.http.get<ResponseGenereDTO[]>(
      `${this.BASE_URL}/genere/film/${idFilm}`
    );
  }


  editById(id: number, dto: EditGenereDTO): Observable<ResponseGenereDTO> {
    return this.http.patch<ResponseGenereDTO>(
      `${this.BASE_URL}/staff/genere/${id}`,
      dto
    );
  }


  removeById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/staff/genere/${id}`);
  }
}
