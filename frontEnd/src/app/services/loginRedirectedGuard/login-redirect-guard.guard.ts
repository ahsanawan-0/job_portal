import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs';

export const loginRedirectGuardGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  const router = inject(Router);

  return service.isAuthenticated().pipe(
    map((isAuth: boolean) => {
      // Check if the current route is 'login'
      if (route.routeConfig?.path === 'login') {
        if (isAuth) {
          // If authenticated, redirect to dashboard
          router.navigate(['/dashboard']);
          return false; // Prevent access to login
        } else {
          return true; // Allow access to login
        }
      } else {
        if (!isAuth) {
          // If not authenticated, redirect to login
          router.navigate(['/login']);
          return false; // Prevent access to other routes
        }
        return true; // Allow access to other routes if authenticated
      }
    })
  );
};
