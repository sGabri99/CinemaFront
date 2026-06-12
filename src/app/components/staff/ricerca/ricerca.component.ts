import { Component } from '@angular/core';
import {LongOmdbResponseApiDto} from "../../../dto/omdbapi/response/long-omdb-response-api-dto";
import {FilmService} from "../../../services/film.service";
import {InsertFilmDTO} from "../../../dto/film/request/insert-film-dto";
import {ResponseFilmDTO} from "../../../dto/film/response/response-film-dto";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-ricerca',
  standalone: true,
  imports: [
    FormsModule,CommonModule,
    RouterLink
  ],
  templateUrl: './ricerca.component.html',
  styleUrl: './ricerca.component.css'
})
export class RicercaComponent {

  stringaRicerca: string = '';

  filmTrovati: LongOmdbResponseApiDto[] = [];

  constructor(private filmService: FilmService) { }

  ricerca(){
    if(!this.stringaRicerca.trim()) return;

    this.filmService.findByTitolo(this.stringaRicerca).subscribe({
      next: (res) =>{
        this.filmTrovati = res;
        if(this.filmTrovati.length === 0){
          alert('Nessun film trovato');
        }
      },
      error: (err) =>{
        console.log('Errore durante la ricerca');
      }
    })
  }

  aggiungi(filmScelto: any) {
    const insertFilm: InsertFilmDTO = {
      titolo: filmScelto.Title,
      descrizione: filmScelto.Plot || '',
      durata: filmScelto.Runtime && filmScelto.Runtime !== 'N/A' ? Number(filmScelto.Runtime.replace(' min', '')) : 0,
      attori: filmScelto.Actors || '',
      urlLocandina: filmScelto.Poster && filmScelto.Poster !== 'N/A' ? filmScelto.Poster : '',
      idGeneri: [1]
    };

    this.filmService.insert(insertFilm).subscribe({
      next: (res: ResponseFilmDTO) => {
        alert(`"${res.titolo}" salvato con successo.`);
      },
      error: (err) => {
        console.error('Errore durante il salvataggio del film.', err);
      }
    });
  }

}
