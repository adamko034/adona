import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { InvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { InvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';
import { invitationActions } from 'src/app/core/invitations/store/actions/invitation.actions';
import { InvitationEffects } from 'src/app/core/invitations/store/effects/invitation.effects';
import { resources } from 'src/app/shared/resources/resources';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Invitation Effects', () => {
  let effects: InvitationEffects;
  let actions$: Actions;

  const {
    invitationsService,
    errorEffectService
  } = SpiesBuilder.init().withErrorEffectService().withInvitationsService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new InvitationEffects(actions$, invitationsService, errorEffectService);

    invitationsService.addInvitation.calls.reset();
  });

  describe('Invitation Send Request', () => {
    let request: InvitationRequest;

    beforeEach(() => {
      request = InvitationRequestBuilder.from('user@example.com', '123', 'team 123', ['user2@example.com']).build();
    });

    it('should add requests and map to Invitation Send Success', () => {
      actions$ = cold('a---a', { a: invitationActions.invitationsSendRequest({ request }) });
      invitationsService.addInvitation.and.returnValue(cold('a', { a: null }));

      expect(effects.invitationSendRequest$).toBeObservable(
        cold('b---b', { b: invitationActions.invitationsSendSuccess() })
      );
      expect(invitationsService.addInvitation).toHaveBeenCalledTimes(2);
      expect(invitationsService.addInvitation).toHaveBeenCalledWith(request);
    });

    it('should map to Invitation Send Failure when service fails', () => {
      actions$ = cold('a---a', { a: invitationActions.invitationsSendRequest({ request }) });
      invitationsService.addInvitation.and.returnValue(cold('#', null, { test: 500 }));

      expect(effects.invitationSendRequest$).toBeObservable(
        cold('b---b', {
          b: invitationActions.invitationsSendFailure({
            error: ErrorBuilder.from().withErrorObject({ test: 500 }).build(),
            toastr: ToastrDataBuilder.from(resources.team.invitation.sendingFailed, ToastrMode.WARNING).build()
          })
        })
      );
      expect(invitationsService.addInvitation).toHaveBeenCalledTimes(2);
      expect(invitationsService.addInvitation).toHaveBeenCalledWith(request);
    });
  });
});
