import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsertUtenteDTO } from '../dto/utente/request/insert-utente-dto';

@Injectable({
    providedIn: 'root'
})
export class StaffService {
    
    private apiUrl = 'http://localhost:8080/api/admin/staff';

    constructor(private http: HttpClient) { }

    // Metodo per inviare i dati del nuovo staff al server
    aggiungiStaff(nuovoStaff: InsertUtenteDTO): Observable<any> {
        return this.http.post<any>(this.apiUrl, nuovoStaff);
    }
}
