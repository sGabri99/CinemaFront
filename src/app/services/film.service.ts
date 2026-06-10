import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {InsertFilmDTO} from '../dto/film/request/insert-film-dto';
import {Observable} from 'rxjs';
import {ResponseFilmDTO} from '../dto/film/response/response-film-dto';
import {EditFilmDTO} from '../dto/film/request/edit-film-dto';
import {LongOmdbResponseApiDto} from '../dto/omdbapi/response/long-omdb-response-api-dto';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}


  insert(dto: InsertFilmDTO): Observable<ResponseFilmDTO> {
    return this.http.post<ResponseFilmDTO>(`${this.BASE_URL}/staff/film`, dto);
  }


  findAll(): Observable<ResponseFilmDTO[]> {
    return this.http.get<ResponseFilmDTO[]>(`${this.BASE_URL}/film`);
  }


  findById(id: number): Observable<ResponseFilmDTO> {
    return this.http.get<ResponseFilmDTO>(`${this.BASE_URL}/film/${id}`);
  }


  findByIdGenere(idGenere: number): Observable<ResponseFilmDTO[]> {
    return this.http.get<ResponseFilmDTO[]>(
      `${this.BASE_URL}/film/genere/${idGenere}`
    );
  }


  findByTitolo(titolo: string): Observable<LongOmdbResponseApiDto[]> {
    return this.http.get<LongOmdbResponseApiDto[]>(
      `${this.BASE_URL}/film/titolo`,
      { params: { titolo } }
    );
  }


  editById(id: number, dto: EditFilmDTO): Observable<ResponseFilmDTO> {
    return this.http.patch<ResponseFilmDTO>(
      `${this.BASE_URL}/staff/film/${id}`,
      dto
    );
  }


  removeById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/staff/film/${id}`);
  }
}
