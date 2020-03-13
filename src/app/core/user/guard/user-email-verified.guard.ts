import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserEmailVerifiedGuard implements CanActivate {
  constructor(private authService: AuthService, private navigationService: NavigationService) {}

  public canActivate(): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      map((user: firebase.User) => {
        if (!!user && !user.emailVerified) {
          return true;
        }

        if (!!user && user.emailVerified) {
          this.navigationService.toHome();
          return false;
        }

        this.navigationService.toLogin();
        return false;
      })
    );
  }
}
