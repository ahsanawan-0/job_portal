import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs';

export const loginRedirectGuardGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  const router = inject(Router);

  return service.isAuthenticated().pipe(
    map((isAuth: boolean) => {
      if (route.routeConfig?.path === 'login') {
        if (isAuth) {
          router.navigate(['/dashboard']);
          return false;
        } else {
          return true;
        }
      } else {
        if (!isAuth) {
          router.navigate(['/login']);
          return false;
        }
        return true;
      }
    })
  );
};
