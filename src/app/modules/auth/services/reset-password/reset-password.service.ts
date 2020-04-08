import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { BackendStateBuilder } from 'src/app/core/gui/model/backend-state/backend-state.builder';
import { BackendState } from 'src/app/core/gui/model/backend-state/backend-state.model';

@Injectable({ providedIn: 'root' })
export class ResetPasswordService {
  constructor(private authService: AuthService) {}

  public sendPasswordResetEmail(email: string): Observable<BackendState> {
    return this.authService.sendPasswordResetEmail(email).pipe(
      first(),
      map(() => BackendStateBuilder.success()),
      catchError(error => of(BackendStateBuilder.failure(error?.code)))
    );
  }

  public confirmPasswordReset(code: string, newPassword: string): Observable<BackendState> {
    return this.authService.confirmPasswordReset(code, newPassword).pipe(
      first(),
      map(() => BackendStateBuilder.success()),
      catchError(error => of(BackendStateBuilder.failure(error?.code)))
    );
  }
}
