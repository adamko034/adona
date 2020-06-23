import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamService } from 'src/app/core/team/services/team.service';
import { teamsActions } from 'src/app/core/team/store/actions';

@Injectable()
export class SelectedTeamEffects {
  constructor(
    private actions$: Actions,
    private teamsService: TeamService,
    private errorEffectsService: ErrorEffectService
  ) {}

  public loadSelectedTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.selectedTeam.loadSelectedTeamRequested),
      switchMap((action) =>
        this.teamsService.loadTeam(action.id).pipe(
          map((team: Team) => teamsActions.selectedTeam.loadSelectedTeamSuccess({ team })),
          catchError((err) => {
            const error = ErrorBuilder.from().withErrorObject(err).build();
            return of(teamsActions.selectedTeam.loadSelectedTeamFailure({ error }));
          })
        )
      )
    );
  });

  public loadSelectedTeamFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    teamsActions.selectedTeam.loadSelectedTeamFailure
  );
}
