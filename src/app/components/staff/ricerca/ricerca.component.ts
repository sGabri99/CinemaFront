import { Component } from '@angular/core';
import {LongOmdbResponseApiDto} from "../../../dto/omdbapi/response/long-omdb-response-api-dto";
import {FilmService} from "../../../services/film.service";
import {InsertFilmDTO} from "../../../dto/film/request/insert-film-dto";
import {ResponseFilmDTO} from "../../../dto/film/response/response-film-dto";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-ricerca',
  standalone: true,
  imports: [
    FormsModule
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

  aggiungi(filmScelto: LongOmdbResponseApiDto){

      const film = filmScelto as LongOmdbResponseApiDto;

      const insertFilm: InsertFilmDTO = {
        titolo: film.title,
        descrizione: film.plot,
        durata: Number(film.runtime.replace(' min', '')),
        attori: film.actors,
        urlLocandina: film.poster && film.poster !== 'N/A' ? film.poster : '',
        idGeneri: [1]
      }

      this.filmService.insert(insertFilm).subscribe({
        next: (res: ResponseFilmDTO) => {
          alert('{res.titolo} salvato con successo');
        },
        error: (err) => {
          console.log('Errore durante il salvataggio del film');
        }
      })
  }

}
