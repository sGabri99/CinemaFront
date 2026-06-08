import { Routes } from '@angular/router';
import {HomeComponent} from './components/shared/home/home.component';
import {PageNotFoundComponent} from './components/shared/page-not-found/page-not-found.component';
import {ListaFilmComponent} from './components/shared/lista-film/lista-film.component';
import {DettaglioFilmComponent} from './components/shared/dettaglio-film/dettaglio-film.component';
import {GestioneFilmComponent} from "./components/film/gestione-film/gestione-film.component";
import {InserisciFilmComponent} from "./components/film/inserisci-film/inserisci-film.component";
import {GestioneGenereComponent} from "./components/film/gestione-generi/gestione-generi.component";

export const routes: Routes = [
  {path: '',pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', title: 'HomePage', component: HomeComponent },
  {path: 'lista-film', title: 'Lista film', component: ListaFilmComponent },
  {path: 'dettaglio-film/:id', title: 'Dettaglio film', component: DettaglioFilmComponent },
  { path: 'gestione-film', title: 'Gestione film', component: GestioneFilmComponent },
  { path: 'inserisci-film', title: 'Inserisci film', component: InserisciFilmComponent },
  { path: 'gestione-generi', title: 'Gestione generi', component: GestioneGenereComponent },
  {path: '**', title: 'Pagina non trovata', component: PageNotFoundComponent}
];
