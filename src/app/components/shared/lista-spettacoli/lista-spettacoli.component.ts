import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SpettacoloService } from '../../../services/spettacolo.service';
import { FilmService } from '../../../services/film.service';
import { AuthService } from '../../../services/auth.service';
import { ResponseSpettacoloDTO } from '../../../dto/spettacolo/response/response-spettacolo-dto';
import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { Ruolo } from '../../../enums/ruolo';

export interface SpettacoloPerFilm {
    film: ResponseFilmDTO;
    spettacoli: ResponseSpettacoloDTO[];
}

export interface GruppoData {
    data: string;
    filmsDelGiorno: SpettacoloPerFilm[];
}

@Component({
    selector: 'app-lista-spettacoli',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './lista-spettacoli.component.html',
    styleUrl: './lista-spettacoli.component.css'
})
export class ListaSpettacoliComponent implements OnInit {
    spettacoli: ResponseSpettacoloDTO[] = [];
    films: ResponseFilmDTO[] = [];
    spettacoliFiltrati: ResponseSpettacoloDTO[] = [];
    loading = false;
    errore: string | null = null;

    dataSelezionata: string = '';
    oggi: string = new Date().toISOString().split('T')[0];

    constructor(
        private spettacoloService: SpettacoloService,
        private filmService: FilmService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.caricaTutti();
    }

    caricaTutti(): void {
        this.loading = true;
        this.errore = null;
        this.dataSelezionata = '';

        forkJoin({
            spettacoli: this.spettacoloService.findAll(),
            films: this.filmService.findAll()
        }).subscribe({
            next: ({ spettacoli, films }) => {
                this.spettacoli = spettacoli;
                this.films = films;
                this.spettacoliFiltrati = spettacoli;
                this.loading = false;
            },
            error: () => {
                this.errore = 'Impossibile caricare gli spettacoli. Riprova più tardi.';
                this.loading = false;
            }
        });
    }

    filtraPerData(): void {
        if (!this.dataSelezionata) {
            this.spettacoliFiltrati = this.spettacoli;
            return;
        }
        this.spettacoliFiltrati = this.spettacoli.filter(s => s.data === this.dataSelezionata);
    }

    filtraOggi(): void {
        this.dataSelezionata = this.oggi;
        this.filtraPerData();
    }

    resetFiltro(): void {
        this.dataSelezionata = '';
        this.spettacoliFiltrati = this.spettacoli;
    }

    isCliente(): boolean {
        return this.authService.isLoggedIn() && this.authService.getRuolo() === Ruolo.CLIENTE;
    }

    getFilmById(idFilm: number): ResponseFilmDTO | undefined {
        return this.films.find(f => f.id === idFilm);
    }

    formatOrario(ora: string): string {
        if (!ora) return '';
        const timePart = ora.includes('T') ? ora.split('T')[1] :
            ora.includes(' ') ? ora.split(' ')[1] : ora;
        return timePart?.substring(0, 5) ?? '';
    }

    formatData(data: string): string {
        if (!data) return '';
        const d = new Date(data + 'T00:00:00');
        return d.toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    }

    // Raggruppa per data, poi per film all'interno della data
    get gruppiPerData(): GruppoData[] {
        // Mappa data -> (idFilm -> spettacoli[])
        const mappaData = new Map<string, Map<number, ResponseSpettacoloDTO[]>>();

        for (const s of this.spettacoliFiltrati) {
            if (!mappaData.has(s.data)) mappaData.set(s.data, new Map());
            const mappaFilm = mappaData.get(s.data)!;
            if (!mappaFilm.has(s.idFilm)) mappaFilm.set(s.idFilm, []);
            mappaFilm.get(s.idFilm)!.push(s);
        }

        return Array.from(mappaData.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([data, mappaFilm]) => ({
                data,
                filmsDelGiorno: Array.from(mappaFilm.entries())
                    .map(([idFilm, spettacoli]) => ({
                        film: this.getFilmById(idFilm) ?? this.filmFallback(spettacoli[0].nomeFilm),
                        spettacoli: spettacoli.sort((a, b) =>
                            this.formatOrario(a.oraInizio).localeCompare(this.formatOrario(b.oraInizio))
                        )
                    }))
            }));
    }

    // Fallback nel caso il film non sia ancora nel catalogo
    private filmFallback(nomeFilm: string): ResponseFilmDTO {
        return { id: 0, titolo: nomeFilm, descrizione: '', durata: 0, attori: '', urlLocandina: '', nomeGeneri: [] };
    }

    get totalFilmDelGiorno(): number {
        return this.gruppiPerData.reduce((acc, g) => acc + g.filmsDelGiorno.length, 0);
    }
}