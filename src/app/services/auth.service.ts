import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LoginRequestDTO } from '../dto/utente/request/login-request-dto';
import { Observable, tap } from 'rxjs';
import { EditPasswordRequest } from '../dto/resetpassword/request/edit-password-request';
import { ResetPasswordResponse } from '../dto/resetpassword/response/reset-password-response';
import { ResetPasswordRequest } from '../dto/resetpassword/request/reset-password-request';
import { jwtDecode } from 'jwt-decode';
import {ResponseUtenteDataDTO} from "../dto/utente/response/response-utente-data-dto";


import { ResponseUtenteDTO } from '../dto/utente/response/response-utente-dto';
import {InsertUtenteDTO} from "../dto/utente/request/insert-utente-dto";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:8080';
  private TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }

  login(dto: LoginRequestDTO): Observable<HttpResponse<null>> {
    return this.http
      .post<null>(`${this.BASE_URL}/login`, dto, { observe: 'response' })
      .pipe(
        tap((response) => {
          const token = response.headers.get('Authorization');
          if (token) {
            localStorage.setItem(this.TOKEN_KEY, token);
          }
        })
      );
  }

  registrazione(dto: InsertUtenteDTO): Observable<ResponseUtenteDTO> {
    return this.http.post<ResponseUtenteDTO>(
        `${this.BASE_URL}/registrazione`,
        dto
    );
  }

  aggiungiStaff(dto: InsertUtenteDTO): Observable<ResponseUtenteDTO> {
    return this.http.post<ResponseUtenteDTO>(
        `${this.BASE_URL}/admin/aggiungi_staff`,
        dto
    );
  }


  editPassword(dto: EditPasswordRequest): Observable<ResetPasswordResponse> {
    return this.http.patch<ResetPasswordResponse>(
      `${this.BASE_URL}/edit_password`,
      dto
    );
  }


  invioResetPassword(email: string): Observable<string> {
    return this.http.get(`${this.BASE_URL}/reset_password/${email}`, {
      responseType: 'text',
    });
  }


  resetPassword(dto: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.http.patch<ResetPasswordResponse>(
      `${this.BASE_URL}/reset_password`,
      dto
    );
  }

  getAllStaff(): Observable<ResponseUtenteDataDTO[]> {
    return this.http.get<ResponseUtenteDataDTO[]>(`${this.BASE_URL}/admin/lista_staff`);
  }






  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getRuolo(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.ruolo || null;
    } catch (e) {
      return null;
    }
  }

  getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub || null;
    } catch (e) {
      return null;
    }
  }




}
