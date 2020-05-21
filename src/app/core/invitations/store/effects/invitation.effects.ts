import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { InvitationsService } from 'src/app/core/invitations/services/invitations-service/invitations.service';
import { invitationActions } from 'src/app/core/invitations/store/actions/invitation.actions';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { ToastrDataBuilder } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';
import { resources } from 'src/app/shared/resources/resources';

@Injectable({ providedIn: 'root' })
export class InvitationEffects {
  constructor(
    private actions$: Actions,
    private invitationsService: InvitationsService,
    private errorEffectsService: ErrorEffectService
  ) {}

  public invitationSendRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invitationActions.invitationsSendRequest),
      switchMap((action) => {
        return this.invitationsService.addRequests(action.request).pipe(
          map(() => invitationActions.invitationsSendSuccess()),
          catchError((err) => {
            const toastr = ToastrDataBuilder.from(resources.team.initations.failed, ToastrMode.WARNING).build();
            const error = ErrorBuilder.from().withErrorObject(err).build();
            return of(invitationActions.invitationsSendFailure({ error, toastr }));
          })
        );
      })
    );
  });

  public invitationsSendFailure$ = this.errorEffectsService.createFrom(
    this.actions$,
    invitationActions.invitationsSendFailure
  );
}
