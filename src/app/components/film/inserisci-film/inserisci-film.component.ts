import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { FilmService } from '../../../services/film.service';
import { GenereService } from '../../../services/genere.service';
import { ResponseGenereDTO } from '../../../dto/genere/response/response-genere-dto';
import { InsertFilmDTO } from '../../../dto/film/request/insert-film-dto';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-inserisci-film',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inserisci-film.component.html',
  styleUrl: './inserisci-film.component.css'
})
export class InserisciFilmComponent implements OnInit {
  readonly defaultPosterUrl = 'https://placehold.co/600x900/1e1e1e/ffffff?text=Locandina';

  generi: ResponseGenereDTO[] = [];
  generiSelezionati: number[] = [];
  generiSelezionatiDettaglio: ResponseGenereDTO[] = [];
  erroreSalvataggio = '';
  salvataggioInCorso = false;

  form = new FormGroup({
    titolo: new FormControl('', Validators.required),
    descrizione: new FormControl('', Validators.required),
    durata: new FormControl(0, [Validators.required, Validators.min(1)]),
    attori: new FormControl('', Validators.required),
    urlLocandina: new FormControl('', Validators.pattern(/^https?:\/\/.+/i)),
    idGeneri: new FormControl<number[]>([], Validators.required)
  });

  constructor(
      private route: ActivatedRoute,
      private filmService: FilmService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.generi = (this.route.snapshot.data['generi'] as ResponseGenereDTO[]) ?? [];
    this.aggiornaGeneriSelezionati();
  }

  toggleGenere(id: number): void {
    this.erroreSalvataggio = '';

    if (this.generiSelezionati.includes(id)) {
      this.generiSelezionati = this.generiSelezionati.filter(genereId => genereId !== id);
    } else {
      this.generiSelezionati = [...this.generiSelezionati, id];
    }

    this.form.controls.idGeneri.setValue(this.generiSelezionati);
    this.form.controls.idGeneri.markAsTouched();
    this.form.controls.idGeneri.updateValueAndValidity();
    this.aggiornaGeneriSelezionati();
  }

  isGenereSelezionato(id: number): boolean {
    return this.generiSelezionati.includes(id);
  }

  aggiornaGeneriSelezionati(): void {
    this.generiSelezionati = this.form.controls.idGeneri.value ?? [];
    this.generiSelezionatiDettaglio = this.generi.filter(genere =>
      this.generiSelezionati.includes(genere.id)
    );
  }

  salva(): void {
    this.form.patchValue({
      titolo: this.form.value.titolo?.trim() ?? '',
      descrizione: this.form.value.descrizione?.trim() ?? '',
      attori: this.form.value.attori?.trim() ?? '',
      urlLocandina: this.form.value.urlLocandina?.trim() ?? ''
    }, { emitEvent: false });

    this.form.updateValueAndValidity();

    if (this.form.invalid || this.generiSelezionati.length === 0) {
      this.form.markAllAsTouched();
      this.form.controls.idGeneri.markAsTouched();
      this.erroreSalvataggio = 'Compila tutti i campi obbligatori e seleziona almeno un genere.';
      return;
    }

    this.erroreSalvataggio = '';
    this.salvataggioInCorso = true;

    const dto: InsertFilmDTO = {
      titolo: this.form.value.titolo!.trim(),
      descrizione: this.form.value.descrizione!.trim(),
      durata: Number(this.form.value.durata!),
      attori: this.form.value.attori!.trim(),
      urlLocandina: this.normalizzaUrlLocandina(this.form.value.urlLocandina),
      idGeneri: this.form.value.idGeneri ?? [],
      imdbID: ''

    };
    this.filmService.insert(dto)
      .pipe(finalize(() => this.salvataggioInCorso = false))
      .subscribe({
        next: () => this.router.navigate(['/gestione-film'], { queryParams: { filmInserito: 'true' } }),
        error: (err) => {
          console.error('ERRORE:', err);
          this.erroreSalvataggio = this.costruisciMessaggioErrore(err);
        }
      });
  }

  private normalizzaUrlLocandina(url: string | null | undefined): string {
    const trimmedUrl = url?.trim() ?? '';
    return trimmedUrl || this.defaultPosterUrl;
  }

  private costruisciMessaggioErrore(err: any): string {
    const erroriValidazione = err?.error?.errori;

    if (erroriValidazione && typeof erroriValidazione === 'object') {
      const etichette: Record<string, string> = {
        titolo: 'Titolo',
        descrizione: 'Descrizione',
        durata: 'Durata',
        attori: 'Attori',
        urlLocandina: 'URL locandina',
        idGeneri: 'Generi'
      };

      return Object.entries(erroriValidazione)
        .map(([campo, messaggio]) => `${etichette[campo] ?? campo}: ${messaggio}`)
        .join(' | ');
    }

    if (typeof err?.error?.message === 'string' && err.error.message.trim()) {
      return err.error.message;
    }

    return 'Salvataggio non riuscito. Controlla i dati inseriti e riprova.';
  }
}
