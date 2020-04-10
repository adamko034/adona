import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { DefaultErrorType } from 'src/app/core/error/enum/default-error-type.enum';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { resetPasswordActions } from 'src/app/modules/auth/store/actions/reset-password.actions';

@Injectable({ providedIn: 'root' })
export class ResetPasswordEffects {
  constructor(
    private actions$: Actions,
    private apiRequestsFacade: ApiRequestsFacade,
    private authService: AuthService,
    private errorEffectServie: ErrorEffectService
  ) {}

  public sendPasswordResetLinkRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(resetPasswordActions.sendPasswordResetLinkRequested),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.sendPasswordResetLink)),
      switchMap((action) => {
        return this.authService.sendPasswordResetEmail(action.email).pipe(
          map(() => resetPasswordActions.sendPasswordResetLinkSuccess()),
          catchError((err) => {
            const error = ErrorBuilder.from()
              .withErrorObject(err)
              .withFirebaseError(apiRequestIds.sendPasswordResetLink, err.code)
              .build();
            return of(resetPasswordActions.sendPasswordResetLinkFailure({ error }));
          })
        );
      })
    );
  });

  public sendPasswordResetLinkSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(resetPasswordActions.sendPasswordResetLinkSuccess),
      map(() => apiRequestActions.requestSuccess({ id: apiRequestIds.sendPasswordResetLink }))
    );
  });

  public sendPasswordResetLinkFailure$ = this.errorEffectServie.createFrom(
    this.actions$,
    resetPasswordActions.sendPasswordResetLinkFailure,
    DefaultErrorType.ApiOther
  );

  public confirmPasswordResetRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(resetPasswordActions.confirmPasswordResetRequested),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.confirmPasswordResetLink)),
      switchMap((action) => {
        return this.authService.confirmPasswordReset(action.oobCode, action.newPassword).pipe(
          map(() => resetPasswordActions.confirmPasswordResetSuccess()),
          catchError((err) => {
            const error = ErrorBuilder.from()
              .withErrorObject(err)
              .withFirebaseError(apiRequestIds.confirmPasswordResetLink, err.code)
              .build();
            return of(resetPasswordActions.confirmPasswordResetFailure({ error }));
          })
        );
      })
    );
  });

  public confirmPasswordResetSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(resetPasswordActions.confirmPasswordResetSuccess),
      map(() => apiRequestActions.requestSuccess({ id: apiRequestIds.confirmPasswordResetLink }))
    );
  });

  public confirmPasswordResetFailure$ = this.errorEffectServie.createFrom(
    this.actions$,
    resetPasswordActions.confirmPasswordResetFailure,
    DefaultErrorType.ApiOther
  );
}
