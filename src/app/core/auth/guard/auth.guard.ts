import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, take, withLatestFrom } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';
import { UserFacade } from '../../user/user.facade';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private facade: UserFacade,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      take(1),
      concatMap(firebaseUser => of(firebaseUser).pipe(withLatestFrom(this.facade.selectUser()))),
      map(([firebaseUser, user]) => {
        if (!firebaseUser || !firebaseUser.emailVerified) {
          throw new Error();
        }

        if (!user) {
          return this.facade.loadUser(firebaseUser.uid);
        }
      }),
      map(() => true),
      catchError(() => {
        this.navigationService.toLogin();
        return of(false);
      })
    );
  }
}
