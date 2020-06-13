import { InvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';

describe('New Invitation Request Builder', () => {
  it('should build from defaults', () => {
    expect(InvitationRequestBuilder.from('adam', 'team1', 'team super', ['user1', 'user2']).build()).toEqual({
      sender: 'adam',
      teamId: 'team1',
      teamName: 'team super',
      recipients: ['user1', 'user2']
    });
  });
});
