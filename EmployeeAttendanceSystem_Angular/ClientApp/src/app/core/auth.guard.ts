import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './models';

/** Blocks a route unless the user is signed in with the given role. */
export function authGuard(requiredRole: Role): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.currentUser();

    if (!auth.isLoggedIn() || !user) {
      return router.createUrlTree(['/login']);
    }
    if (user.role !== requiredRole) {
      return router.createUrlTree([auth.homeRouteFor(user)]);
    }
    return true;
  };
}

/** Keeps signed-in users off the login/register screens. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.currentUser();

  if (auth.isLoggedIn() && user) {
    return router.createUrlTree([auth.homeRouteFor(user)]);
  }
  return true;
};
