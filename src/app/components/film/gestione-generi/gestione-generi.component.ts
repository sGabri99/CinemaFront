import { Component, OnInit } from '@angular/core';
import { ResponseGenereDTO } from "../../../dto/genere/response/response-genere-dto";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GenereService } from "../../../services/genere.service";
import { InsertGenereDTO } from "../../../dto/genere/request/insert-genere-dto";
import { ConfirmDialogService } from "../../../services/confirm-dialog.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-gestione-generi',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './gestione-generi.component.html',
  styleUrl: './gestione-generi.component.css'
})
export class GestioneGenereComponent implements OnInit {

  generi: ResponseGenereDTO[] = [];

  form = new FormGroup({
    nome: new FormControl('', Validators.required)
  });

  constructor(
      private route: ActivatedRoute,
      private genereService: GenereService,
      private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.generi = (this.route.snapshot.data['generi'] as ResponseGenereDTO[]) ?? [];
  }


  inserisci(): void {
  const dto: InsertGenereDTO = { nome: this.form.value.nome! };
this.genereService.insert(dto).subscribe(() => {
  this.form.reset();
  // Ricarica la lista dopo l'inserimento (operazione mutante → chiamata HTTP necessaria)
  this.genereService.findAll().subscribe(generi => this.generi = generi);
});
}



  elimina(id: number): void {
    this.confirmDialogService.confirm({
      title: 'Elimina genere',
      message: 'Sei sicuro di voler eliminare questo genere?',
      confirmText: 'Elimina'
    }).subscribe(conferma => {
      if (!conferma) {
        return;
      }

      this.genereService.removeById(id).subscribe(() => {
        this.generi = this.generi.filter(genere => genere.id !== id);
      });
    });
  }
}
