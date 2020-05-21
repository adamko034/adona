import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { NewInvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { invitationActions } from 'src/app/core/invitations/store/actions/invitation.actions';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/test/teams-test-data.builder';
import { ToastrDataBuilder } from 'src/app/shared/components/ui/toastr/models/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/shared/components/ui/toastr/models/toastr-mode/toastr-mode.enum';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';

describe('Invitations Actions', () => {
  it('should create Invitation Send Request action', () => {
    const user = UserTestBuilder.withDefaultData().build();
    const team = TeamsTestDataBuilder.withDefaultData().build()[0];
    const request = NewInvitationRequestBuilder.from(user, team).build();

    expect(invitationActions.invitationsSendRequest({ request })).toEqual({
      type: '[New Team Dialog] Invitations Send Request',
      request
    });
  });

  it('should create Invitation Send Success action', () => {
    expect(invitationActions.invitationsSendSuccess()).toEqual({
      type: '[Database API] Invitations Send Success'
    });
  });

  it('should create Invitation Send Failure action', () => {
    const toastr = ToastrDataBuilder.from('test message', ToastrMode.INFO).build();
    const error = ErrorTestDataBuilder.from().withDefaultData().build();
    expect(invitationActions.invitationsSendFailure({ error, toastr })).toEqual({
      type: '[Database API] Invitations Send Failure',
      error,
      toastr
    });
  });
});
