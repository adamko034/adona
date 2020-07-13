import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { TeamService } from 'src/app/core/team/services/team.service';
import { teamsActions } from 'src/app/core/team/store/actions';

@Injectable()
export class TeamsEffects {
  constructor(
    private actions$: Actions,
    private apiRequestsFacade: ApiRequestsFacade,
    private teamService: TeamService,
    private errorEffectService: ErrorEffectService
  ) {}

  public loadTeamsRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.teams.loadTeamsRequested),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.loadTeams)),
      switchMap(() =>
        this.teamService.getAll().pipe(
          map((teams) => teamsActions.teams.loadTeamsSuccess({ teams })),
          tap(() => this.apiRequestsFacade.successRequest(apiRequestIds.loadTeams)),
          catchError((err) => {
            const error = ErrorBuilder.from()
              .withErrorObject(err)
              .withFirebaseError(apiRequestIds.loadTeams, '')
              .build();
            return of(teamsActions.teams.loadTeamsFailure({ error }));
          })
        )
      )
    );
  });

  public loadTeamsFailure$ = this.errorEffectService.createFrom(this.actions$, teamsActions.teams.loadTeamsFailure);
}
