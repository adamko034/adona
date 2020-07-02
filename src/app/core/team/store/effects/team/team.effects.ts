import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamService } from 'src/app/core/team/services/team.service';
import { teamsActions } from 'src/app/core/team/store/actions';

@Injectable()
export class TeamEffects {
  constructor(
    private actions$: Actions,
    private teamsService: TeamService,
    private errorEffectsService: ErrorEffectService,
    private guiFacade: GuiFacade
  ) {}

  public loadTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.team.loadTeamRequested),
      switchMap((action) =>
        this.teamsService.loadTeam(action.id).pipe(
          map((team: Team) => teamsActions.team.loadTeamSuccess({ team })),
          catchError((err) => {
            const error = ErrorBuilder.from().withErrorObject(err).build();
            return of(teamsActions.team.loadTeamFailure({ error }));
          })
        )
      )
    );
  });

  public loadTeamSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamsActions.team.loadTeamSuccess),
        tap(() => this.guiFacade.hideLoading())
      );
    },
    { dispatch: false }
  );

  public loadSelectedTeamFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    teamsActions.team.loadTeamFailure
  );
}
