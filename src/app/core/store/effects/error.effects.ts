import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { FirebaseErrorsService } from 'src/app/core/api-requests/services/firebase-errors/firebase-errors.service';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { errorActions } from 'src/app/core/store/actions/error.actions';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Injectable()
export class ErrorEffects {
  constructor(
    private actions$: Actions,
    private environmentService: EnvironmentService,
    private firebaseErrorsService: FirebaseErrorsService,
    private apiRequestsFacade: ApiRequestsFacade,
    private guiFacade: GuiFacade
  ) {}

  public handle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(errorActions.handleError),
      tap(() => this.guiFacade.hideLoading()),
      concatMap((action) => of(action).pipe(withLatestFrom(this.apiRequestsFacade.selectApiRequest(action.error.id)))),
      switchMap(([action, apiRequest]) => {
        if (this.firebaseErrorsService.isErrorHandled(action.error?.code)) {
          return [apiRequestActions.requestFail({ id: action.error.id, errorCode: action.error.code })];
        }

        const actions: any[] = [errorActions.broadcastError({ error: action.error })];

        if (apiRequest) {
          actions.push(apiRequestActions.requestFail({ id: action.error.id, errorCode: null }));
        }

        return actions;
      })
    );
  });

  public broadcast$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(errorActions.broadcastError),
        tap((action) => {
          if (this.environmentService.isDev()) {
            console.error(action.error);
          }
        })
      );
    },
    { dispatch: false }
  );
}
