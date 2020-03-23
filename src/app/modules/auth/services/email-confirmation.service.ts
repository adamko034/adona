import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class EmailConfirmationService {
  constructor(private authService: AuthService) {}

  public sendUsingAuthorizedUser(): Observable<void> {
    return this.authService.getAuthState().pipe(mergeMap((firebaseUser: firebase.User) => this.send(firebaseUser)));
  }

  public send(firebaseUser: firebase.User): Observable<void> {
    if (!firebaseUser) {
      return throwError(new Error('Auth not set'));
    }

    return from(firebaseUser.sendEmailVerification());
  }
}
