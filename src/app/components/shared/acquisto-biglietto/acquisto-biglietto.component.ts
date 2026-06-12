import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponseSpettacoloDTO } from '../../../dto/spettacolo/response/response-spettacolo-dto';
import { ResponseFilmDTO } from '../../../dto/film/response/response-film-dto';
import { ResponseBigliettoDTO } from '../../../dto/biglietto/response/response-biglietto-dto';
import { BigliettoService } from '../../../services/biglietto.service';
import { SalaService } from '../../../services/sala.service';
import { AuthService } from '../../../services/auth.service';
import { Tipo } from '../../../enums/tipo';

// Prezzo base per singolo biglietto in base al tipo di sala
const PREZZI_TIPO_SALA: Record<Tipo, number> = {
  [Tipo.NORMALE]: 6.5,
  [Tipo.TRED]: 9,
  [Tipo.IMAX]: 12,
};

@Component({
  selector: 'app-acquisto-biglietto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acquisto-biglietto.component.html',
  styleUrl: './acquisto-biglietto.component.css'
})
export class AcquistoBigliettoComponent implements OnInit {
  @Input({ required: true }) film!: ResponseFilmDTO;
  @Input({ required: true }) spettacolo!: ResponseSpettacoloDTO;

  @Output() chiudi = new EventEmitter<void>();
  @Output() acquistoConfermato = new EventEmitter<ResponseBigliettoDTO[]>();

  numeroBiglietti = 1;
  tipoSala: Tipo | null = null;
  prezzoUnitario = PREZZI_TIPO_SALA[Tipo.NORMALE];

  emailAcquirente: string | null = null;

  loading = false;
  errore: string | null = null;

  constructor(
    private bigliettoService: BigliettoService,
    private salaService: SalaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.emailAcquirente = this.authService.getEmail();

    this.salaService.findByNome(this.spettacolo.nomeSala).subscribe({
      next: (sala) => {
        this.tipoSala = sala.tipo;
        this.prezzoUnitario = PREZZI_TIPO_SALA[sala.tipo] ?? PREZZI_TIPO_SALA[Tipo.NORMALE];
      },
      error: () => {
        // Se la sala non viene trovata si usa il prezzo di default (Normale)
        this.tipoSala = null;
      }
    });
  }

  get postiDisponibili(): number {
    return this.spettacolo?.postiRimanenti ?? 0;
  }

  get totale(): number {
    return this.prezzoUnitario * this.numeroBiglietti;
  }

  incrementa(): void {
    if (this.numeroBiglietti < this.postiDisponibili) {
      this.numeroBiglietti++;
    }
  }

  decrementa(): void {
    if (this.numeroBiglietti > 1) {
      this.numeroBiglietti--;
    }
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

  chiudiModale(): void {
    if (this.loading) return;
    this.chiudi.emit();
  }

  confermaAcquisto(): void {
    if (this.loading) return;

    if (this.numeroBiglietti < 1 || this.numeroBiglietti > this.postiDisponibili) {
      this.errore = 'Numero di biglietti non valido per i posti disponibili.';
      return;
    }

    this.loading = true;
    this.errore = null;

    this.bigliettoService.insert({
      idSpettacolo: this.spettacolo.id,
      numeroBiglietti: this.numeroBiglietti
    }).subscribe({
      next: (biglietti) => {
        this.loading = false;
        this.spettacolo.postiRimanenti = Math.max(0, this.spettacolo.postiRimanenti - this.numeroBiglietti);
        this.acquistoConfermato.emit(biglietti);
      },
      error: () => {
        this.loading = false;
        this.errore = 'Impossibile completare l\'acquisto. Riprova più tardi.';
      }
    });
  }
}
