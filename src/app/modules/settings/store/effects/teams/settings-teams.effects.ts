import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { TeamsFirebaseService } from 'src/app/modules/settings/services/teams-firebase/teams-firebase.service';
import { settingsActions } from 'src/app/modules/settings/store/actions';

@Injectable()
export class SettingsTeamsEffects {
  constructor(
    private actions$: Actions,
    private teamsFirebaseSerivce: TeamsFirebaseService,
    private errorEffectsService: ErrorEffectService,
    private apiRequestsFacade: ApiRequestsFacade
  ) {}

  public loadTeamsRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(settingsActions.teams.loadTeamsRequested),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.settingsLoadTeams)),
      switchMap(() =>
        this.teamsFirebaseSerivce.getAll().pipe(
          map((teams) => settingsActions.teams.loadTeamsSuccess({ teams })),
          catchError((err) => {
            const error = ErrorBuilder.from()
              .withErrorObject(err)
              .withFirebaseError(apiRequestIds.settingsLoadTeams, '')
              .build();
            return of(settingsActions.teams.loadTeamsFailure({ error }));
          })
        )
      )
    );
  });

  public loadTeamsSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(settingsActions.teams.loadTeamsSuccess),
        tap(() => this.apiRequestsFacade.successRequest(apiRequestIds.settingsLoadTeams))
      );
    },
    { dispatch: false }
  );

  public loadTeamsFailure$ = this.errorEffectsService.createFrom(this.actions$, settingsActions.teams.loadTeamsFailure);
}
