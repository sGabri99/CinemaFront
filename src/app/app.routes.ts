import { Routes } from '@angular/router';
import {HomeComponent} from './components/shared/home/home.component';
import {PageNotFoundComponent} from './components/shared/page-not-found/page-not-found.component';

export const routes: Routes = [
  {path: '',pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', title: 'HomePage', component: HomeComponent },
  {path: '**', title: 'Pagina non trovata', component: PageNotFoundComponent}
];
