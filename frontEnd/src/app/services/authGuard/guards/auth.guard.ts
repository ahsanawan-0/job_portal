import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  const router = inject(Router);

  return service.isAuthenticated().pipe(
    map((isAuth: boolean) => {
      if (isAuth) {
        console.log(isAuth);
        return true; // Allow navigation if authenticated
      } else {
        router.navigate(['/login']); // Redirect to login if not authenticated
        return false; // Block navigation
      }
    })
  );
};
