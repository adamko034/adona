import { NewInvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { NewInvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/test/teams-test-data.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';

const user = UserTestBuilder.withDefaultData().build();
const team = TeamsTestDataBuilder.withDefaultData().build()[0];

describe('New Invitation Request Builder', () => {
  it('should build from defaults', () => {
    expect(NewInvitationRequestBuilder.from(user, team).build()).toEqual(createRequest());
  });
});

function createRequest(): NewInvitationRequest {
  return {
    sender: user,
    team
  };
}
