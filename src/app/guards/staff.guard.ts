import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const staffGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const ruolo = auth.getRuolo();
  if (ruolo === 'STAFF' || ruolo === 'SUPERADMIN') return true;
  router.navigateByUrl('/home');
  return false;
};
