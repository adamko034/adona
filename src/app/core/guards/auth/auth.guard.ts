import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.authState$.pipe(
      map(authState => {
        if (authState) {
          return true;
        }

        this.navigationService.toLogin();
        return false;
      })
    );
  }
}
