import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token')?.replace(/^Bearer\s+/i, '').trim();
  const richiedeAuth = req.url.includes('/staff/') ||
    req.url.includes('/admin/') ||
    req.url.includes('/cliente/') ||
    req.url.includes('/user/') ||
    req.url.endsWith('/edit_password');

  if (!token || !richiedeAuth) {
    return next(req);
  }

  const copy = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(copy);
};
