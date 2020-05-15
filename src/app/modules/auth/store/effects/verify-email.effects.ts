import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { EmailConfirmationService } from 'src/app/modules/auth/services/email-confirmation.service';
import { verifyEmailActions } from 'src/app/modules/auth/store/actions/verify-email.actions';

@Injectable({ providedIn: 'root' })
export class VerifyEmailEffects {
  constructor(
    private actions$: Actions,
    private apiRequestsFacade: ApiRequestsFacade,
    private authService: AuthService,
    private emailConfirmationService: EmailConfirmationService,
    private errorEffectsService: ErrorEffectService
  ) {}

  public confirmEmailRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(verifyEmailActions.confirmEmailRequested),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.confirmEmailVerification)),
      switchMap((action) => {
        return this.authService.confirmEmail(action.code).pipe(
          map(() => verifyEmailActions.confirmEmailSuccess()),
          catchError((err) => {
            const error = ErrorBuilder.from()
              .withErrorObject(err)
              .withFirebaseError(apiRequestIds.confirmEmailVerification, err.code)
              .build();
            return of(verifyEmailActions.confirmEmailFailure({ error }));
          })
        );
      })
    );
  });

  public confirmEmailSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(verifyEmailActions.confirmEmailSuccess),
      map(() => apiRequestActions.requestSuccess({ id: apiRequestIds.confirmEmailVerification }))
    );
  });

  public confirmEmailFailure = this.errorEffectsService.createFrom(
    this.actions$,
    verifyEmailActions.confirmEmailFailure
  );

  public sendEmailVerificationLinkRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(verifyEmailActions.sendEmailVerificationLinkRequested),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.sendEmailVerificationLink)),
      switchMap(() => {
        return this.emailConfirmationService.sendUsingAuthorizedUser().pipe(
          map(() => verifyEmailActions.sendEmailVerificationLinkSuccess()),
          catchError((err) => {
            const error = ErrorBuilder.from()
              .withErrorObject(err)
              .withFirebaseError(apiRequestIds.sendEmailVerificationLink, err.code)
              .build();
            return of(verifyEmailActions.sendEmailVerificationLinkFailure({ error }));
          })
        );
      })
    );
  });

  public sendEmailVerificationLinkSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(verifyEmailActions.sendEmailVerificationLinkSuccess),
      map(() => apiRequestActions.requestSuccess({ id: apiRequestIds.sendEmailVerificationLink }))
    );
  });

  public sendEmailConfirmationLinkFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    verifyEmailActions.sendEmailVerificationLinkFailure
  );
}
