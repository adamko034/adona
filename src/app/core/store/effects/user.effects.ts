import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { InvitationStatus } from 'src/app/core/invitations/models/invitation-status.enum';
import { Invitation } from 'src/app/core/invitations/models/invitation/invitation.model';
import { InvitationsService } from 'src/app/core/invitations/services/invitations-service/invitations.service';
import { UserTeamBuilder } from 'src/app/core/user/model/builders/user-team.builder';
import { resources } from 'src/app/shared/resources/resources';
import { ResourceService } from 'src/app/shared/resources/services/resource.service';
import { Logger } from 'src/app/shared/utils/logger/logger';
import { ErrorEffectService } from '../../services/store/error-effect.service';
import { ChangeTeamRequest } from '../../team/model/change-team-request.model';
import { User } from '../../user/model/user.model';
import { UserService } from '../../user/services/user.service';
import { userActions } from '../actions/user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private errorEffectService: ErrorEffectService,
    private guiFacade: GuiFacade,
    private invitationService: InvitationsService,
    private resourceService: ResourceService
  ) {}

  public loadUserRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.loadUserRequested),
      switchMap((action) =>
        this.userService.loadUser(action.id).pipe(
          map((user: User) => userActions.loadUserSuccess({ user })),
          catchError((err) => of(userActions.loadUserFailure({ error: { errorObj: err } })))
        )
      )
    );
  });

  public changeTeamRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.changeTeamRequested),
      tap(() => this.guiFacade.showLoading()),
      map((action) => action.request),
      switchMap((request: ChangeTeamRequest) =>
        this.userService.changeTeam(request).pipe(
          map(() => userActions.changeTeamSuccess({ teamId: request.teamId, updated: request.updated })),
          tap(() => this.guiFacade.hideLoading()),
          catchError((err) => of(userActions.changeTeamFailure({ error: { errorObj: err } })))
        )
      )
    );
  });

  public loadUserFailure$ = this.errorEffectService.createFrom(this.actions$, userActions.loadUserFailure);

  public changeTeamFailure$ = this.errorEffectService.createFrom(this.actions$, userActions.changeTeamFailure);

  public updateNameRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.updateNameRequested),
      switchMap((action) =>
        this.userService.updateName(action.id, action.newName).pipe(
          map((newName: string) => userActions.updateNameSuccess({ newName })),
          catchError((err) =>
            of(
              userActions.updateNameFailure({
                error: ErrorBuilder.from().withErrorObject(err).build()
              })
            )
          )
        )
      )
    );
  });

  public updateNameFailure$ = this.errorEffectService.createFrom(this.actions$, userActions.updateNameFailure);

  public handleInvitationRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.handleInvitationRequested),
      filter((action) => !!action.user.invitationId),
      tap(() => Logger.logDev('User Effect: Handle Invitation Requested, starting')),
      switchMap((action) => {
        Logger.logDev('user effect, handle invitation requested, calling service to get invitation');
        return this.invitationService.get(action.user.invitationId).pipe(
          map((invitation: Invitation) => {
            Logger.logDev('user effect, handle invitation requested, got invitation ' + invitation.status);
            if (invitation.status === InvitationStatus.Sent) {
              return userActions.handleInvitationAccept({ user: action.user, invitation });
            }

            return userActions.handleInvitationReject();
          }),
          catchError((err) => {
            Logger.logDev('user effect, handle invitation requested, catch error');
            const error = ErrorBuilder.from().withErrorObject(err).build();
            const toastr = ToastrDataBuilder.from(resources.team.invitation.acceptingFailed, ToastrMode.ERROR).build();
            return of(userActions.handleInvitationFailure({ error, toastr }));
          })
        );
      })
    );
  });

  public handleInvitationAccept$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userActions.handleInvitationAccept),
      tap(() => Logger.logDev('user effect, handle invitation accept, starting')),
      switchMap(({ user, invitation }) => {
        Logger.logDev('user effect, handle invitation accept, calling service');
        return this.userService.handleInvitation(user, invitation).pipe(
          tap(() => Logger.logDev('user effect, handle invitation accept, service ok')),
          map(() => {
            const userTeam = UserTeamBuilder.from(invitation.teamId, invitation.teamName, new Date()).build();
            return userActions.handleInvitationSuccess({ userTeam });
          }),
          catchError((err) => {
            Logger.logDev('user effect, handle invitation accept, catch error');
            const error = ErrorBuilder.from().withErrorObject(err).build();
            const toastr = ToastrDataBuilder.from(resources.team.invitation.acceptingFailed, ToastrMode.ERROR).build();
            return of(userActions.handleInvitationFailure({ error, toastr }));
          })
        );
      })
    );
  });

  public handleInvitationSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(userActions.handleInvitationSuccess),
        map((action) => {
          Logger.logDev('user effect, handle invitation success, starting and showing toastr');
          const toastr = ToastrDataBuilder.from(
            this.resourceService.format(resources.team.invitation.accepted, action.userTeam.name),
            ToastrMode.SUCCESS
          ).build();

          this.guiFacade.showToastr(toastr);
          return action;
        })
      );
    },
    { dispatch: false }
  );

  public handleInvitationReject$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(userActions.handleInvitationReject),
        tap(() => Logger.logDev('user effect, handle invitation reject, starting,')),
        map((action) => {
          Logger.logDev('user effect, handle invitation reject, showing toastr and hiding loading');
          this.guiFacade.hideLoading();

          const toastr = ToastrDataBuilder.from(resources.team.invitation.rejected, ToastrMode.WARNING).build();
          this.guiFacade.showToastr(toastr);
          return action;
        })
      );
    },
    { dispatch: false }
  );

  public handleInvitationFailure$ = this.errorEffectService.createFrom(
    this.actions$,
    userActions.handleInvitationFailure
  );
}
