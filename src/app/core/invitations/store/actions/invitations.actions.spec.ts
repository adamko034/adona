import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { InvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { invitationActions } from 'src/app/core/invitations/store/actions/invitation.actions';

describe('Invitations Actions', () => {
  it('should create Invitation Send Request action', () => {
    const request = InvitationRequestBuilder.from('user@example.com', '123', 'team 123', ['user2@example.com']).build();

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
