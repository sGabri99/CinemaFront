import { Routes } from '@angular/router';
import {HomeComponent} from './components/shared/home/home.component';
import {PageNotFoundComponent} from './components/shared/page-not-found/page-not-found.component';
import {ListaFilmComponent} from './components/shared/lista-film/lista-film.component';
import {DettaglioFilmComponent} from './components/shared/dettaglio-film/dettaglio-film.component';
import {LoginComponent} from './components/shared/login/login.component';
import {RegistrazioneComponent} from './components/shared/registrazione/registrazione.component';
import {ListaSpettacoliComponent} from './components/shared/lista-spettacoli/lista-spettacoli.component';

export const routes: Routes = [
  {path: '',pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', title: 'HomePage', component: HomeComponent },
  {path: 'lista-film', title: 'Lista film', component: ListaFilmComponent },
  {path: 'dettaglio-film/:id', title: 'Dettaglio film', component: DettaglioFilmComponent },
  {path: 'lista-spettacoli', title: 'Lista spettacoli', component: ListaSpettacoliComponent },
  {path: 'login', title: 'Login', component: LoginComponent },
  {path: 'registrazione', title: 'Registrazione', component: RegistrazioneComponent },
  {path: '**', title: 'Pagina non trovata', component: PageNotFoundComponent}
];
