import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ApiService } from '../api.service';

/**
 * Guard that determines if a route can be activated based on user authentication status.
 * @function authGuard
 * @param {ActivatedRouteSnapshot} route - Contains the information about the route being accessed.
 * @param {RouterStateSnapshot} state - Represents the state of the router at a specific moment in time, including the current URL.
 * @returns {Observable<boolean>} - Returns an observable that emits `true` if the user is authenticated, allowing the route activation. If the user is not authenticated, it redirects to the login page and returns an observable emitting `false`.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService) as ApiService;
  const router = inject(Router) as Router;

  // if user is authenticated return true
  // in case of error redirect and return false
  return apiService.isAuthenticated().pipe(
    map(() => {
      return true;
    }),
    catchError(() => {
      router.navigate(['/auth']);
      return of(false);
    })
  );
};
