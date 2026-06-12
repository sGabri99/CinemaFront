import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FilmService } from '../../../services/film.service';
import { GenereService } from '../../../services/genere.service';
import { ResponseGenereDTO } from '../../../dto/genere/response/response-genere-dto';
import { InsertFilmDTO } from '../../../dto/film/request/insert-film-dto';

@Component({
  selector: 'app-inserisci-film',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inserisci-film.component.html',
  styleUrl: './inserisci-film.component.css'
})
export class InserisciFilmComponent implements OnInit {

  generi: ResponseGenereDTO[] = [];
  generiSelezionati: number[] = [];

  form = new FormGroup({
    titolo: new FormControl('', Validators.required),
    descrizione: new FormControl('', Validators.required),
    durata: new FormControl(0, Validators.required),
    attori: new FormControl('', Validators.required),
    urlLocandina: new FormControl('')
  });

  constructor(
      private filmService: FilmService,
      private genereService: GenereService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.genereService.findAll().subscribe(generi => {
      this.generi = generi;
    });
  }

  selezionaGenere(id: number): void {
    if (this.generiSelezionati.includes(id)) {
      this.generiSelezionati = this.generiSelezionati.filter(x => x !== id);
    } else {
      this.generiSelezionati.push(id);
    }
  }

  salva(): void {
    const dto: InsertFilmDTO = {
      titolo: this.form.value.titolo!,
      descrizione: this.form.value.descrizione!,
      durata: this.form.value.durata!,
      attori: this.form.value.attori!,
      urlLocandina: this.form.value.urlLocandina!,
      idGeneri: this.generiSelezionati
    };
    this.filmService.insert(dto).subscribe({
      next: () => this.router.navigateByUrl('/gestione-film'),
      error: (err) => console.error('ERRORE:', err)  // 👈 aggiunto
    });
  }
}