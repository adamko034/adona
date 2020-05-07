import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mapTo, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { DefaultErrorType } from 'src/app/core/error/enum/default-error-type.enum';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { TeamMembersBuilder } from 'src/app/core/team/model/builders/team-members.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request.model';
import { TeamService } from 'src/app/core/team/services/team.service';
import { UserBuilder } from 'src/app/core/user/model/builders/user.builder';
import { UserService } from 'src/app/core/user/services/user.service';
import { EmailConfirmationService } from 'src/app/modules/auth/services/email-confirmation.service';
import { registerActions } from 'src/app/modules/auth/store/actions/register.actions';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Injectable({ providedIn: 'root' })
export class RegisterEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private userService: UserService,
    private emailConfirmationService: EmailConfirmationService,
    private apiRequestsFacade: ApiRequestsFacade,
    private navigationService: NavigationService,
    private errorEffectsService: ErrorEffectService,
    private teamService: TeamService
  ) {}

  public registerRequested$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(registerActions.registerRequested),
      tap(() => this.apiRequestsFacade.startRequest(apiRequestIds.register)),
      switchMap((action) => {
        return this.authService.register(action.credentials).pipe(
          switchMap((firebaseUser: firebase.User) => {
            const photoUrl = firebaseUser.photoURL || UserBuilder.defaultPhotoUrl;
            const user = UserBuilder.from(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName)
              .withPhotoUrl(photoUrl)
              .build();

            return this.userService.createUser(user).pipe(mapTo({ firebaseUser, photoUrl }));
          }),
          switchMap(({ firebaseUser, photoUrl }) => {
            const team: NewTeamRequest = {
              created: new Date(),
              createdBy: firebaseUser.displayName,
              name: 'Personal',
              members: TeamMembersBuilder.from().withMember(firebaseUser.displayName, photoUrl).build()
            };

            return this.teamService.addTeam(team, firebaseUser.uid).pipe(mapTo(firebaseUser));
          }),
          mergeMap((firebaseUser: firebase.User) => {
            return this.emailConfirmationService.send(firebaseUser);
          }),
          map(() => registerActions.registerSuccess()),
          catchError((err) => {
            const error = ErrorBuilder.from()
              .withErrorObject(err)
              .withFirebaseError(apiRequestIds.register, err?.code)
              .build();

            return of(registerActions.registerFailure({ error }));
          })
        );
      })
    );
  });

  public registerSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(registerActions.registerSuccess),
      tap(() => this.navigationService.toVerifyEmail()),
      map(() => apiRequestActions.requestSuccess({ id: apiRequestIds.register }))
    );
  });

  public registerFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    registerActions.registerFailure,
    DefaultErrorType.ApiOther
  );
}
