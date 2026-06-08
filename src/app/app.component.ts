import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './components/shared/navbar/navbar.component';
import {HomeComponent} from './components/shared/home/home.component';
import {LoginComponent} from "./components/shared/login/login.component";
import {RegistrazioneComponent} from "./components/shared/registrazione/registrazione.component";
import {ListaSpettacoliComponent} from "./components/shared/lista-spettacoli/lista-spettacoli.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, LoginComponent, RegistrazioneComponent, ListaSpettacoliComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CinemaFront';
}
