import { Routes } from '@angular/router';
import {HomeComponent} from './components/shared/home/home.component';
import {PageNotFoundComponent} from './components/shared/page-not-found/page-not-found.component';
import {ListaFilmComponent} from './components/shared/lista-film/lista-film.component';
import {DettaglioFilmComponent} from './components/shared/dettaglio-film/dettaglio-film.component';
import {GestioneFilmComponent} from "./components/film/gestione-film/gestione-film.component";
import {InserisciFilmComponent} from "./components/film/inserisci-film/inserisci-film.component";
import {GestioneGenereComponent} from "./components/film/gestione-generi/gestione-generi.component";
import {RegistrazioneComponent} from "./components/shared/registrazione/registrazione.component";
import {LoginComponent} from "./components/shared/login/login.component";
import {ListaSpettacoliComponent} from "./components/shared/lista-spettacoli/lista-spettacoli.component";
import {ForgotPasswordComponent} from "./components/shared/forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./components/shared/reset-password/reset-password.component";
import {ProfiloComponent} from "./components/cliente/profilo/profilo.component";
import {staffGuard} from "./guards/staff.guard";

export const routes: Routes = [
  {path: '',pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', title: 'HomePage', component: HomeComponent },
  {path: 'lista-film', title: 'Lista film', component: ListaFilmComponent },
  {path: 'dettaglio-film/:id', title: 'Dettaglio film', component: DettaglioFilmComponent },
  { path: 'gestione-film', title: 'Gestione film', component: GestioneFilmComponent , canActivate: [staffGuard] },
  { path: 'inserisci-film', title: 'Inserisci film', component: InserisciFilmComponent, canActivate: [staffGuard] },
  { path: 'gestione-generi', title: 'Gestione generi', component: GestioneGenereComponent , canActivate: [staffGuard]},
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'registrazione', title: 'Registrazione', component: RegistrazioneComponent },
  { path: 'lista-spettacoli', title: 'Lista Spettacoli', component: ListaSpettacoliComponent },
  { path: 'password-dimenticata', title: 'Password dimenticata', component: ForgotPasswordComponent },
  { path: 'password-reset', title: 'Password reset', component: ResetPasswordComponent },
  { path: 'profilo', title: 'Profilo', component: ProfiloComponent },

  { path: 'staff', loadChildren: () => import('./routes/staff.routes').then(m => m.staffRoutes) },

  {path: '**', title: 'Pagina non trovata', component: PageNotFoundComponent}
];
