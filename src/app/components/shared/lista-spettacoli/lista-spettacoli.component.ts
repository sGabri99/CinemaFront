import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ResponseSpettacoloDTO } from '../../../dto/spettacolo/response/response-spettacolo-dto';
import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { Ruolo } from '../../../enums/ruolo';
import { AcquistoBigliettoComponent } from '../acquisto-biglietto/acquisto-biglietto.component';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { ResponseBigliettoDTO } from '../../../dto/biglietto/response/response-biglietto-dto';
import {ListaSpettacoliResolverData} from "../../../app.resolver";

export interface SpettacoloPerFilm {
    filmKey: string;
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
    imports: [CommonModule, FormsModule, RouterLink, AcquistoBigliettoComponent],
    templateUrl: './lista-spettacoli.component.html',
    styleUrl: './lista-spettacoli.component.css'
})
export class ListaSpettacoliComponent implements OnInit {
    spettacoli: ResponseSpettacoloDTO[] = [];
    films: ResponseFilmDTO[] = [];
    spettacoliFiltrati: ResponseSpettacoloDTO[] = [];
    errore: string | null = null;
    messaggio: string | null = null;
    prenotazioniInCorso = new Set<string>();
    spettacoliSelezionati: Record<string, ResponseSpettacoloDTO> = {};

    dataSelezionata: string = '';
    oggi: string = new Date().toISOString().split('T')[0];
    loading = false;



    /**
     * Restituisce true se lo spettacolo non è ancora iniziato.
     * Confronta data + oraInizio con il momento attuale.
     */
    isFuturo(spettacolo: ResponseSpettacoloDTO): boolean {
        const timePart = spettacolo.oraInizio.includes('T')
            ? spettacolo.oraInizio.split('T')[1]
            : spettacolo.oraInizio.includes(' ')
                ? spettacolo.oraInizio.split(' ')[1]
                : spettacolo.oraInizio;
        const ora = timePart?.substring(0, 5) ?? '00:00'; // "HH:mm"
        const dataOraSpettacolo = new Date(`${spettacolo.data}T${ora}:00`);
        return dataOraSpettacolo > new Date();
    }

    // Modale di acquisto biglietto
    modaleAperta = false;
    filmInAcquisto: ResponseFilmDTO | null = null;
    spettacoloInAcquisto: ResponseSpettacoloDTO | null = null;

    constructor(
        private route: ActivatedRoute,

        private authService: AuthService,
        private confirmDialogService: ConfirmDialogService
    ) {}

    ngOnInit(): void {
        const dati = this.route.snapshot.data['dati'] as ListaSpettacoliResolverData;
        this.films = dati.films ?? [];
        this.spettacoli = (dati.spettacoli ?? []).filter(s => this.isFuturo(s));
        this.spettacoliFiltrati = this.spettacoli;
        this.inizializzaSelezioni();
    }



    filtraPerData(): void {
        if (!this.dataSelezionata) {
            this.spettacoliFiltrati = this.spettacoli;
            return;
        }
        this.spettacoliFiltrati = this.spettacoli.filter(s => s.data === this.dataSelezionata);
        this.inizializzaSelezioni();
    }

    filtraOggi(): void {
        this.dataSelezionata = this.oggi;
        this.filtraPerData();
    }

    resetFiltro(): void {
        this.dataSelezionata = '';
        this.spettacoliFiltrati = this.spettacoli;
        this.inizializzaSelezioni();
    }

    isCliente(): boolean {
        return this.authService.isLoggedIn() && this.authService.getRuolo() === Ruolo.CLIENTE;
    }

    getFilmById(idFilm?: number): ResponseFilmDTO | undefined {
        if (!idFilm) return undefined;
        return this.films.find(f => f.id === idFilm);
    }

    getFilmBySpettacolo(spettacolo: ResponseSpettacoloDTO): ResponseFilmDTO | undefined {
        return this.getFilmById(spettacolo.idFilm) ??
            this.films.find(f => this.normalizzaTesto(f.titolo) === this.normalizzaTesto(spettacolo.nomeFilm));
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

    durataLabel(durata: number): string {
        if (!durata) return '';
        const ore = Math.floor(durata / 60);
        const minuti = durata % 60;
        return ore ? `${ore}h ${minuti}m` : `${minuti}m`;
    }

    generiLabel(film: ResponseFilmDTO): string {
        return film.nomeGeneri?.length ? film.nomeGeneri.join(' / ') : 'Cinema';
    }

    selezionaSpettacolo(data: string, filmKey: string, spettacolo: ResponseSpettacoloDTO): void {
        if (spettacolo.postiRimanenti === 0) return;
        this.spettacoliSelezionati[this.selectionKey(data, filmKey)] = spettacolo;
        this.messaggio = null;
        this.errore = null;
    }

    spettacoloSelezionato(data: string, filmKey: string): ResponseSpettacoloDTO | undefined {
        return this.spettacoliSelezionati[this.selectionKey(data, filmKey)];
    }

    isOrarioSelezionato(data: string, filmKey: string, spettacolo: ResponseSpettacoloDTO): boolean {
        return this.spettacoloSelezionato(data, filmKey)?.id === spettacolo.id;
    }

    prenota(data: string, filmKey: string): void {
        const spettacolo = this.spettacoloSelezionato(data, filmKey);

        if (!this.isCliente()) {
            this.errore = 'Per prenotare devi effettuare il login con un account cliente.';
            this.messaggio = null;
            return;
        }

        if (!spettacolo || spettacolo.postiRimanenti === 0) {
            this.errore = 'Seleziona un orario disponibile.';
            this.messaggio = null;
            return;
        }

        this.errore = null;
        this.messaggio = null;

        const entry = this.gruppiPerData
            .find(g => g.data === data)?.filmsDelGiorno
            .find(e => e.filmKey === filmKey);

        this.filmInAcquisto = entry?.film ?? null;
        this.spettacoloInAcquisto = spettacolo;
        this.modaleAperta = true;
    }

    chiudiModaleAcquisto(): void {
        this.modaleAperta = false;
        this.filmInAcquisto = null;
        this.spettacoloInAcquisto = null;
    }

    onAcquistoConfermato(biglietti: ResponseBigliettoDTO[]): void {
        const orario = this.spettacoloInAcquisto ? this.formatOrario(this.spettacoloInAcquisto.oraInizio) : '';
        const quantita = biglietti.length;
        this.messaggio = quantita === 1
            ? `Acquisto confermato per ${orario}.`
            : `Acquisto confermato per ${quantita} biglietti alle ${orario}.`;
        this.errore = null;
        this.chiudiModaleAcquisto();
        this.confirmDialogService.notifySuccess(
            quantita === 1
                ? `Il tuo biglietto per le ${orario} è stato acquistato con successo.`
                : `I tuoi ${quantita} biglietti per le ${orario} sono stati acquistati con successo.`
        ).subscribe();
    }

    isPrenotazioneInCorso(data: string, filmKey: string): boolean {
        return this.prenotazioniInCorso.has(this.selectionKey(data, filmKey));
    }

    get gruppiPerData(): GruppoData[] {
        const mappaData = new Map<string, Map<string, ResponseSpettacoloDTO[]>>();

        for (const s of this.spettacoliFiltrati) {
            if (!mappaData.has(s.data)) mappaData.set(s.data, new Map());
            const mappaFilm = mappaData.get(s.data)!;
            const filmKey = this.filmKeyFromSpettacolo(s);
            if (!mappaFilm.has(filmKey)) mappaFilm.set(filmKey, []);
            mappaFilm.get(filmKey)!.push(s);
        }

        return Array.from(mappaData.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([data, mappaFilm]) => ({
                data,
                filmsDelGiorno: Array.from(mappaFilm.entries())
                    .map(([filmKey, spettacoli]) => ({
                        filmKey,
                        film: this.getFilmBySpettacolo(spettacoli[0]) ?? this.filmFallback(spettacoli[0].nomeFilm),
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

    private inizializzaSelezioni(): void {
        for (const gruppo of this.gruppiPerData) {
            for (const entry of gruppo.filmsDelGiorno) {
                const key = this.selectionKey(gruppo.data, entry.filmKey);
                if (this.spettacoliSelezionati[key]) continue;

                const primoDisponibile = entry.spettacoli.find(s => s.postiRimanenti > 0);
                if (primoDisponibile) {
                    this.spettacoliSelezionati[key] = primoDisponibile;
                }
            }
        }
    }

    private filmKeyFromSpettacolo(spettacolo: ResponseSpettacoloDTO): string {
        return spettacolo.idFilm ? `id-${spettacolo.idFilm}` : `titolo-${this.normalizzaTesto(spettacolo.nomeFilm)}`;
    }

    private normalizzaTesto(value: string): string {
        return (value ?? '').trim().toLowerCase();
    }

    private selectionKey(data: string, filmKey: string): string {
        return `${data}-${filmKey}`;
    }


}
