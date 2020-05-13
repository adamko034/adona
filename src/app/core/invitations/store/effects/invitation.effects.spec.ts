import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { NewInvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { NewInvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';
import { invitationActions } from 'src/app/core/invitations/store/actions/invitation.actions';
import { InvitationEffects } from 'src/app/core/invitations/store/effects/invitation.effects';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/test/teams-test-data.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';

describe('Invitation Effects', () => {
  let effects: InvitationEffects;
  let actions$: Actions;

  const { invitationsService } = SpiesBuilder.init().withInvitationsService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new InvitationEffects(actions$, invitationsService);

    invitationsService.addRequests.calls.reset();
  });

  describe('Invitation Send Request', () => {
    let request: NewInvitationRequest;
    const user = UserTestBuilder.withDefaultData().build();
    const team = TeamsTestDataBuilder.withDefaultData().build()[0];

    beforeEach(() => {
      request = NewInvitationRequestBuilder.from(user, team).build();
    });

    it('should add requests and map to Invitation Send Success', () => {
      actions$ = cold('a---a', { a: invitationActions.invitationsSendRequest({ request }) });
      invitationsService.addRequests.and.returnValue(cold('a', { a: null }));

      expect(effects.invitationSendRequest$).toBeObservable(
        cold('b---b', { b: invitationActions.invitationsSendSuccess() })
      );
      expect(invitationsService.addRequests).toHaveBeenCalledTimes(2);
      expect(invitationsService.addRequests).toHaveBeenCalledWith(request);
    });

    it('should map to Invitation Send Failure when service fails', () => {
      actions$ = cold('a---a', { a: invitationActions.invitationsSendRequest({ request }) });
      invitationsService.addRequests.and.returnValue(cold('#', null, { test: 500 }));

      expect(effects.invitationSendRequest$).toBeObservable(
        cold('b---b', {
          b: invitationActions.invitationsSendFailure({
            error: ErrorBuilder.from().withErrorObject({ test: 500 }).build()
          })
        })
      );
      expect(invitationsService.addRequests).toHaveBeenCalledTimes(2);
      expect(invitationsService.addRequests).toHaveBeenCalledWith(request);
    });
  });
});
