import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from "../../../services/film.service";
import { ResponseFilmDTO } from "../../../dto/film/response/response-film-dto";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestione-film',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './gestione-film.component.html',
  styleUrl: './gestione-film.component.css'
})
export class GestioneFilmComponent implements OnInit {

  films: ResponseFilmDTO[] = [];
  filmInserito = false;

  constructor(
      private filmService: FilmService,
      private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Legge il query param ?filmInserito=true passato da inserisci-film
    this.route.queryParams.subscribe(params => {
      if (params['filmInserito'] === 'true') {
        this.filmInserito = true;
        // Nasconde il banner automaticamente dopo 4 secondi
        setTimeout(() => this.filmInserito = false, 4000);
      }
    });

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
