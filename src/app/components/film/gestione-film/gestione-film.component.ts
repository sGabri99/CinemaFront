import { Component } from '@angular/core';
import {FilmService} from "../../../services/film.service";
import {ResponseFilmDTO} from "../../../dto/film/response/response-film-dto";

@Component({
  selector: 'app-gestione-film',
  imports: [],
  templateUrl: './gestione-film.component.html',
  styleUrl: './gestione-film.component.css'
})
export class GestioneFilmComponent {

  films: ResponseFilmDTO [] = [];

  constructor(private filmService: FilmService) {
  }

  ngOnInit(): void {
    this.filmService.findAll().subscribe(films => {
      this.films = films;
    });
  }

  elimina(id: number): void {
    this.filmService.removeById(id).subscribe(() => {
      this.films = this.films.filter(film => film.id !== id);
    })
  }


}