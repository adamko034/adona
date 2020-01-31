import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take, withLatestFrom } from 'rxjs/operators';
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

  canActivate(): Observable<boolean> | boolean {
    return this.authService.getAuthState().pipe(
      take(1),
      withLatestFrom(this.facade.selectUser()),
      map(([firebaseUser, user]) => {
        if (!firebaseUser) {
          throw new Error();
        }

        if (!user) {
          return this.facade.getUser(firebaseUser.uid);
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
