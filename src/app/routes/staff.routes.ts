import {Routes} from '@angular/router';
import {BigliettiUtenteComponent} from "../components/staff/biglietti-utente/biglietti-utente.component";

export const staffRoutes: Routes = [
    {
        path: '',
        title: 'Staff - Dashboard',
        loadComponent: () => import('../components/staff/staff-home/staff-home.component')
            .then(m => m.StaffHomeComponent)
    },
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
    },
    {
        path: 'gestione-staff',
        title: 'Gestione Staff - SuperAdmin',
        loadComponent: () => import('../components/staff/gestione-staff/gestione-staff.component')
            .then(m => m.GestioneStaffComponent)
    }
];
