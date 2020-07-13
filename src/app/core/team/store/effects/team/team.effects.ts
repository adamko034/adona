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
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamService } from 'src/app/core/team/services/team.service';
import { teamsActions } from 'src/app/core/team/store/actions';
import { UserTeamBuilder } from 'src/app/core/user/model/user-team/user-team.builder';
import { UserFacade } from 'src/app/core/user/user.facade';
import { resources } from 'src/app/shared/resources/resources';
import { ResourceService } from 'src/app/shared/resources/services/resource.service';

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
    private resourceService: ResourceService
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

  public loadTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.team.loadTeamRequested),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.loadTeam)),
      switchMap((action) =>
        this.teamsService.getTeam(action.id).pipe(
          map((team: Team) => teamsActions.team.loadTeamSuccess({ team })),
          tap(() => this.apiRequestsFacade.successRequest(apiRequestIds.loadTeam)),
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

  public updateTeamNameRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.team.updateNameRequested),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.updateTeamName)),
      switchMap(({ request }) =>
        this.teamsService.updateName(request.id, request.name).pipe(
          map(() => teamsActions.team.updateNameSuccess({ teamId: request.id, newName: request.name })),
          tap(() => this.apiRequestsFacade.successRequest(apiRequestIds.updateTeamName)),
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

  public loadTeamFailure$ = this.errorEffectsService.createFrom(this.actions$, teamsActions.team.loadTeamFailure);

  public newTeamCreateFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    teamsActions.team.newTeamCreateFailure
  );

  public updateTeamNameFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    teamsActions.team.updateNameFailure
  );
}
