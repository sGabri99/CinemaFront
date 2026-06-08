import {Routes} from '@angular/router';
import {BigliettiUtenteComponent} from "../components/staff/biglietti-utente/biglietti-utente.component";

export const staffRoutes: Routes = [
    {
        path: 'biglietti-utente',
        title: 'Biglietti Utente',
        loadComponent: () => import('../components/staff/biglietti-utente/biglietti-utente.component')
            .then(m => m.BigliettiUtenteComponent)
    },
    {
        path: 'gestione-spettacoli',
        title: 'Gestione Spettacoli',
        loadComponent: () => import('../components/staff/gestione-spettacoli/gestione-spettacoli.component')
            .then(m => m.GestioneSpettacoliComponent)
    },
    {
        path: 'ricerca',
        title: 'Ricerca Catalogo',
        loadComponent: () => import('../components/staff/ricerca/ricerca.component')
            .then(m => m.RicercaComponent)
    }
]
