import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilmService } from "../../../services/film.service";
import { ResponseFilmDTO } from "../../../dto/film/response/response-film-dto";

@Component({
  selector: 'app-gestione-film',
  imports: [RouterLink],
  templateUrl: './gestione-film.component.html',
  styleUrl: './gestione-film.component.css'
})
export class GestioneFilmComponent implements OnInit {

  films: ResponseFilmDTO[] = [];

  constructor(private filmService: FilmService) {}

  ngOnInit(): void {
    this.filmService.findAll().subscribe(films => {
      this.films = films;
    });
  }

  elimina(id: number): void {
    this.filmService.removeById(id).subscribe({
      next: () => this.films = this.films.filter(film => film.id !== id),
      error: (err) => console.error('Errore eliminazione:', err)
    });
  }
}