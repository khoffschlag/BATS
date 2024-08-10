import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ApiService } from '../api.service';

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
