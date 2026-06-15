import {Routes} from '@angular/router';
import {staffGuard} from "../guards/staff.guard";

export const staffRoutes: Routes = [
    {
        path: '',
        title: 'Staff - Dashboard',
        loadComponent: () => import('../components/staff/staff-home/staff-home.component')
            .then(m => m.StaffHomeComponent)
    },

    {
        path: 'gestione-staff',
        title: 'Gestione Staff - SuperAdmin',
        loadComponent: () => import('../components/staff/gestione-staff/gestione-staff.component')
            .then(m => m.GestioneStaffComponent)
    }
];
