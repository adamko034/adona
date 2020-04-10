import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ApiRequestStateBuilder } from 'src/app/core/gui/model/backend-state/api-request-state.builder';
import { ApiRequestState } from 'src/app/core/gui/model/backend-state/api-request-state.model';

@Injectable({ providedIn: 'root' })
export class ResetPasswordService {
  constructor(private authService: AuthService) {}

  public sendPasswordResetEmail(email: string): Observable<ApiRequestState> {
    return this.authService.sendPasswordResetEmail(email).pipe(
      first(),
      map(() => ApiRequestStateBuilder.success()),
      catchError((error) => of(ApiRequestStateBuilder.fail(error?.code)))
    );
  }

  public confirmPasswordReset(code: string, newPassword: string): Observable<ApiRequestState> {
    return this.authService.confirmPasswordReset(code, newPassword).pipe(
      first(),
      map(() => ApiRequestStateBuilder.success()),
      catchError((error) => of(ApiRequestStateBuilder.fail(error?.code)))
    );
  }
}
