import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { InvitationsFacade } from 'src/app/core/invitations/invitations.facade';
import { InvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { TeamService } from 'src/app/core/team/services/team.service';
import { teamsActions } from 'src/app/core/team/store/actions';
import { UserTeamBuilder } from 'src/app/core/user/model/user-team/user-team.builder';
import { UserFacade } from 'src/app/core/user/user.facade';
import { resources } from 'src/app/shared/resources/resources';
import { ResourceService } from 'src/app/shared/resources/services/resource.service';

@Injectable()
export class TeamsEffects {
  constructor(
    private actions$: Actions,
    private userFacade: UserFacade,
    private teamService: TeamService,
    private errorEffectService: ErrorEffectService,
    private guiFacade: GuiFacade,
    private invitationsFacade: InvitationsFacade,
    private resource: ResourceService
  ) {}

  public newTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.teams.newTeamRequested),
      tap(() => this.guiFacade.showLoading()),
      concatMap((action) => of(action).pipe(withLatestFrom(this.userFacade.selectUser()))),
      switchMap(([action, user]) =>
        this.teamService.addTeam(user, action.request).pipe(
          map((id) => teamsActions.teams.newTeamCreateSuccess({ id, user, request: action.request })),
          catchError((err) => of(teamsActions.teams.newTeamCreateFailure({ error: { errorObj: err } })))
        )
      )
    );
  });

  public newTeamCreateSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(teamsActions.teams.newTeamCreateSuccess),
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
          this.resource.format(resources.team.created, action.request.name),
          ToastrMode.SUCCESS
        ).build();

        this.guiFacade.showToastr(toastrData);
        this.guiFacade.hideLoading();

        const userTeam = UserTeamBuilder.from(action.id, action.request.name).build();
        return userActions.teamAdded({ team: userTeam });
      })
    );
  });

  public newTeamCreateFailure$ = this.errorEffectService.createFrom(
    this.actions$,
    teamsActions.teams.newTeamCreateFailure
  );
}
