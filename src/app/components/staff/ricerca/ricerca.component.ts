import { Component } from '@angular/core';
import {LongOmdbResponseApiDto} from "../../../dto/omdbapi/response/long-omdb-response-api-dto";
import {FilmService} from "../../../services/film.service";
import {InsertFilmDTO} from "../../../dto/film/request/insert-film-dto";
import {ResponseFilmDTO} from "../../../dto/film/response/response-film-dto";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-ricerca',
  standalone: true,
  imports: [
    FormsModule,CommonModule
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
      next: (res: any) => {
        console.log("Dati ricevuti dal server:", res);

        // Verifichiamo se la risposta è un array valido e non vuoto
        if (Array.isArray(res) && res.length > 0) {
          this.filmTrovati = res;
        }
        // Se il backend ti ha mandato l'oggetto singolo anziché l'array per i film nuovi
        else if (res && res.Title) {
          this.filmTrovati = [res];
        }
        // Se la risposta è vuota o contiene un errore di OMDb (es. Response: "False")
        else {
          this.filmTrovati = [];
          alert('Film non trovato nel database globale di OMDb.');
        }
      },
      error: (err) => {
        console.error('Errore durante la chiamata al backend:', err);
        this.filmTrovati = [];
        alert('Impossibile recuperare il film. Controlla la console del backend Spring Boot per vedere l\'errore SQL o di API.');
      }
    });
  }

private eseguiInserimento(filmScelto:any){
  const insertFilm: InsertFilmDTO = {
    titolo: filmScelto.Title,
    descrizione: filmScelto.Plot || '',
    durata: filmScelto.Runtime && filmScelto.Runtime !== 'N/A' ? Number(filmScelto.Runtime.replace(' min', '')) : 0,
    attori: filmScelto.Actors || '',
    urlLocandina: filmScelto.Poster && filmScelto.Poster !== 'N/A' ? filmScelto.Poster : '',
    imdbID: filmScelto.imdbID && filmScelto.imdbID !== 'N/A' ? filmScelto.imdbID : '',

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






  aggiungi(filmScelto: any) {
    const imdbId = filmScelto.imdbID;

    this.filmService.existsByImdbId(imdbId).subscribe({
      next: (esiste: boolean) => {
        if (esiste) {
          alert("Attenzione: questo film è già presente nel database!");
        } else {
          this.eseguiInserimento(filmScelto);
        }
      },
      error: (err) => {
        console.error("Errore durante il controllo di esistenza", err);
      }
    });
  }




}
