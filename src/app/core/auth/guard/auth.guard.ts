import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { NavigationService } from 'src/app/core/services/navigation/navigation.service';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { authQueries } from 'src/app/core/store/selectors/auth.selectors';
import { AuthFacade } from 'src/app/core/auth/auth.facade';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private facade: AuthFacade,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.authState$.pipe(
      withLatestFrom(this.facade.isLoggedIn()),
      map(([firebaseUser, isLoggedId]) => {
        if (firebaseUser) {
          if (!isLoggedId) {
            this.facade.authenticate(firebaseUser);
          }

          return true;
        }

        this.navigationService.toLogin();
        return false;
      })
    );
  }
}
