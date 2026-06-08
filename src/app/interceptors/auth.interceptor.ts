import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.url.includes('/login')){
    return next(req);
  }else{
    let copy = req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    return next(copy);
  }
};
