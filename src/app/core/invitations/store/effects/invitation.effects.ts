import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { InvitationsService } from 'src/app/core/invitations/services/invitations-service/invitations.service';
import { invitationActions } from 'src/app/core/invitations/store/actions/invitation.actions';

@Injectable({ providedIn: 'root' })
export class InvitationEffects {
  constructor(private actions$: Actions, private invitationsService: InvitationsService) {}

  public invitationSendRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invitationActions.invitationsSendRequest),
      switchMap((action) => {
        return this.invitationsService.addRequests(action.request).pipe(
          map(() => invitationActions.invitationsSendSuccess()),
          catchError((err) => {
            const error = ErrorBuilder.from().withErrorObject(err).build();
            return of(invitationActions.invitationsSendFailure({ error }));
          })
        );
      })
    );
  });
}
