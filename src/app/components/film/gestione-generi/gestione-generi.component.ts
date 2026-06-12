import { Component, OnInit } from '@angular/core';
import { ResponseGenereDTO } from "../../../dto/genere/response/response-genere-dto";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { GenereService } from "../../../services/genere.service";
import { InsertGenereDTO } from "../../../dto/genere/request/insert-genere-dto";

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

  constructor(private genereService: GenereService) {}

  ngOnInit(): void {
    this.genereService.findAll().subscribe(generi => {
      this.generi = generi;
    });
  }

  inserisci(): void {
    const dto: InsertGenereDTO = {
      nome: this.form.value.nome!
    };
    this.genereService.insert(dto).subscribe(() => {
      this.form.reset();
      this.genereService.findAll().subscribe(generi => {
        this.generi = generi;
      });
    });
  }

  elimina(id: number): void {
    this.genereService.removeById(id).subscribe(() => {
      this.generi = this.generi.filter(genere => genere.id !== id);
    });
  }
}