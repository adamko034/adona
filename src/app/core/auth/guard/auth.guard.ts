import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, withLatestFrom } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UserFacade } from '../../user/user.facade';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private facade: UserFacade, private authService: AuthService) {}

  canActivate(): Observable<boolean> | boolean {
    return this.authService.authState$.pipe(
      withLatestFrom(this.facade.getUser()),
      map(([firebaseUser, user]) => {
        if (!firebaseUser) {
          throw new Error();
        }

        if (!user) {
          return this.facade.findUser(firebaseUser.uid);
        }
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }
}
