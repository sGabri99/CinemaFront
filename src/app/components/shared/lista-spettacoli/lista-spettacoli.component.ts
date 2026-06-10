import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpettacoloService } from '../../../services/spettacolo.service';
import { ResponseSpettacoloDTO } from '../../../dto/spettacolo/response/response-spettacolo-dto';

@Component({
    selector: 'app-lista-spettacoli',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './lista-spettacoli.component.html',
    styleUrl: './lista-spettacoli.component.css'
})
export class ListaSpettacoliComponent implements OnInit {
    spettacoli: ResponseSpettacoloDTO[] = [];
    spettacoliFiltrati: ResponseSpettacoloDTO[] = [];
    loading = false;
    errore: string | null = null;

    dataSelezionata: string = '';
    oggi: string = new Date().toISOString().split('T')[0];

    constructor(private spettacoloService: SpettacoloService) {}

    ngOnInit(): void {
        this.caricaTutti();
    }

    caricaTutti(): void {
        this.loading = true;
        this.errore = null;
        this.dataSelezionata = '';
        this.spettacoloService.findAll().subscribe({
            next: (data) => {
                this.spettacoli = data;
                this.spettacoliFiltrati = data;
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
        this.loading = true;
        this.errore = null;
        this.spettacoloService.findByData(this.dataSelezionata).subscribe({
            next: (data) => {
                this.spettacoliFiltrati = data;
                this.loading = false;
            },
            error: () => {
                this.errore = 'Errore nel filtrare per data.';
                this.loading = false;
            }
        });
    }

    filtraOggi(): void {
        this.dataSelezionata = this.oggi;
        this.filtraPerData();
    }

    resetFiltro(): void {
        this.caricaTutti();
    }

    formatOrario(ora: string): string {
        if (!ora) return '';
        // Gestisce sia "2026-06-10 15:00:00" che "2026-06-10T15:00:00" che "15:00:00"
        const timePart = ora.includes('T') ? ora.split('T')[1] :
            ora.includes(' ') ? ora.split(' ')[1] : ora;
        return timePart?.substring(0, 5) ?? '';
    }

    formatData(data: string): string {
        if (!data) return '';
        const d = new Date(data);
        return d.toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    }

    // Raggruppa spettacoli per data
    get spettacoliPerData(): { data: string; items: ResponseSpettacoloDTO[] }[] {
        const mappa = new Map<string, ResponseSpettacoloDTO[]>();
        for (const s of this.spettacoliFiltrati) {
            const key = s.data;
            if (!mappa.has(key)) mappa.set(key, []);
            mappa.get(key)!.push(s);
        }
        return Array.from(mappa.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([data, items]) => ({ data, items }));
    }
}
