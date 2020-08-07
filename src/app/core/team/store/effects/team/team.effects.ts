import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { InvitationsFacade } from 'src/app/core/invitations/invitations.facade';
import { InvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamService } from 'src/app/core/team/services/team.service';
import { teamsActions } from 'src/app/core/team/store/actions';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { UserTeamBuilder } from 'src/app/core/user/model/user-team/user-team.builder';
import { UserFacade } from 'src/app/core/user/user.facade';
import { resources } from 'src/app/shared/resources/resources';
import { ResourceService } from 'src/app/shared/resources/services/resource.service';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable()
export class TeamEffects {
  constructor(
    private actions$: Actions,
    private teamsService: TeamService,
    private errorEffectsService: ErrorEffectService,
    private guiFacade: GuiFacade,
    private apiRequestsFacade: ApiRequestsFacade,
    private userFacade: UserFacade,
    private invitationsFacade: InvitationsFacade,
    private resourceService: ResourceService,
    private teamsFacade: TeamsFacade,
    private routerFacade: RouterFacade
  ) {}

  public newTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.team.newTeamRequested),
      tap(() => this.guiFacade.showLoading()),
      concatMap((action) => of(action).pipe(withLatestFrom(this.userFacade.selectUser()))),
      switchMap(([action, user]) =>
        this.teamsService.addTeam(user, action.request).pipe(
          map((id) => teamsActions.team.newTeamCreateSuccess({ id, user, request: action.request })),
          catchError((err) => of(teamsActions.team.newTeamCreateFailure({ error: { errorObj: err } })))
        )
      )
    );
  });

  public newTeamCreateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.team.newTeamCreateSuccess),
      map((action) => {
        const recipients = action.request.members
          .filter((m) => !!m.email && m.email !== action.user.email)
          .map((m) => m.email);

        if (recipients.length > 0) {
          const invitationsReqeust = InvitationRequestBuilder.from(
            action.user.email,
            action.id,
            action.request.name,
            recipients
          ).build();
          this.invitationsFacade.send(invitationsReqeust);
        }

        const toastrData = ToastrDataBuilder.from(
          this.resourceService.format(resources.team.created, action.request.name),
          ToastrMode.SUCCESS
        ).build();

        this.guiFacade.showToastr(toastrData);
        this.guiFacade.hideLoading();

        const userTeam = UserTeamBuilder.from(action.id, action.request.name).build();
        return userActions.teamAdded({ team: userTeam });
      })
    );
  });

  public loadSelectedTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.team.loadSelectedTeamRequested),
      tap(() => Logger.logDev('load selected team requested effect, waiting for user')),
      tap(() => this.guiFacade.showLoading()),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.loadTeam)),
      concatMap(() => of(undefined).pipe(withLatestFrom(this.userFacade.selectUser()))),
      switchMap(([, user]) =>
        this.teamsService.getTeam(user.selectedTeamId).pipe(
          map((team) => {
            if (!team) {
              Logger.logDev('load selected team requested effect, selected team not found, changing to personal team');
              return userActions.changeTeamRequested({ teamId: user.personalTeamId });
            }

            Logger.logDev('load selected team requested effect, got selected team');
            return teamsActions.team.loadTeamSuccess({ team });
          }),
          catchError((err) => {
            const error = ErrorBuilder.from()
              .withErrorObject(err)
              .withFirebaseError(apiRequestIds.loadTeam, '')
              .build();
            return of(teamsActions.team.loadTeamFailure({ error }));
          })
        )
      )
    );
  });

  public loadTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.team.loadTeamRequested),
      tap(() => Logger.logDev('load team requested effect, loading team')),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.loadTeam)),
      switchMap((action) =>
        this.teamsService.getTeam(action.id).pipe(
          tap(() => Logger.logDev('load team requested effect, got team')),
          map((team: Team) => teamsActions.team.loadTeamSuccess({ team })),
          catchError((err) => {
            const error = ErrorBuilder.from()
              .withErrorObject(err)
              .withFirebaseError(apiRequestIds.loadTeam, '')
              .build();
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
        tap(() => {
          this.guiFacade.hideLoading();
          this.apiRequestsFacade.successRequest(apiRequestIds.loadTeam);
        })
      );
    },
    { dispatch: false }
  );

  public updateTeamNameRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.team.updateNameRequested),
      tap(() => this.guiFacade.showLoading()),
      switchMap(({ request }) =>
        this.teamsService.updateName(request.id, request.name).pipe(
          concatMap(() => of(request).pipe(withLatestFrom(this.teamsFacade.selectTeam(request.id)))),
          map(([, currentTeam]) => {
            const updatedTeam = TeamBuilder.fromTeam(currentTeam).withName(request.name).build();
            this.userFacade.updateTeamName(request);
            return teamsActions.team.updateNameSuccess({ team: updatedTeam });
          }),
          catchError((err) => {
            const error = ErrorBuilder.from()
              .withErrorObject(err)
              .withFirebaseError(apiRequestIds.updateTeamName, '')
              .build();
            return of(teamsActions.team.updateNameFailure({ error }));
          })
        )
      )
    );
  });

  public updateTeamNameSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamsActions.team.updateNameSuccess),
        tap(() => this.guiFacade.hideLoading())
      );
    },
    { dispatch: false }
  );

  public deleteTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.team.deleteTeamRequested),
      tap(() => Logger.logDev('team effect, delete team requested')),
      tap(() => this.guiFacade.showLoading()),
      concatMap((action) => of(action).pipe(withLatestFrom(this.userFacade.selectUser()))),
      switchMap(([{ id }, user]) => {
        if (id === user.personalTeamId) {
          const error = ErrorBuilder.from().withErrorMessage(resources.team.personalTeamRemovalError).build();
          return of(teamsActions.team.deleteTeamFailure({ error }));
        }

        return this.teamsService.delete(id).pipe(
          map(() => teamsActions.team.deleteTeamSuccess({ id })),
          catchError((err) => {
            const error = ErrorBuilder.from().withErrorObject(err).build();
            return of(teamsActions.team.deleteTeamFailure({ error }));
          })
        );
      })
    );
  });

  public deleteTeamSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(teamsActions.team.deleteTeamSuccess),
        tap(() => Logger.logDev('team effects, delete team success')),
        concatMap((action) => of(action).pipe(withLatestFrom(this.userFacade.selectUser()))),
        tap(([action, user]) => {
          this.userFacade.deleteTeam(action.id);

          if (user.selectedTeamId === action.id) {
            this.userFacade.changeTeam(user.personalTeamId);
          } else {
            this.guiFacade.hideLoading();
            const toastr = ToastrDataBuilder.from(resources.team.deleted, ToastrMode.SUCCESS).build();
            this.guiFacade.showToastr(toastr);
          }
        }),
        tap(([action]) => this.routerFacade.navigateAfterTeamDeleted(action.id)),
        map(([action]) => action)
      );
    },
    { dispatch: false }
  );

  public loadTeamFailure$ = this.errorEffectsService.createFrom(this.actions$, teamsActions.team.loadTeamFailure);

  public newTeamCreateFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    teamsActions.team.newTeamCreateFailure
  );

  public updateTeamNameFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    teamsActions.team.updateNameFailure
  );

  public deleteTeamFailure$ = this.errorEffectsService.createFrom(this.actions$, teamsActions.team.deleteTeamFailure);
}
