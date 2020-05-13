import { InvitationStatus } from 'src/app/core/invitations/models/invitation-status.enum';
import { InvitationBuilder } from 'src/app/core/invitations/models/invitation/invitation.builder';
import { Invitation } from 'src/app/core/invitations/models/invitation/invitation.model';

const id = '1';
const sender = 'user.sender@example.com';
const recipient = 'user.recipient@example.com';
const teamId = 'team1';
const teamName = 'example team';
const mockDate = new Date();

describe('Invitation Builder', () => {
  beforeAll(() => {
    jasmine.clock().mockDate(mockDate);
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  it('should build with defaults', () => {
    expect(InvitationBuilder.from(id, recipient, sender, teamId, teamName).build()).toEqual(createInvitation());
  });

  it('should build with Created date', () => {
    const date = new Date(2020, 2, 2);
    expect(InvitationBuilder.from(id, recipient, sender, teamId, teamName).withCreated(date).build()).toEqual(
      createInvitation(date)
    );
  });

  it('should build with Status', () => {
    const status = InvitationStatus.Sent;
    expect(InvitationBuilder.from(id, recipient, sender, teamId, teamName).withStatus(status).build()).toEqual(
      createInvitation(null, status)
    );
  });
});

function createInvitation(date?: Date, status?: InvitationStatus): Invitation {
  return {
    id,
    recipientEmail: recipient,
    senderEmail: sender,
    teamId,
    teamName,
    created: date || mockDate,
    status: status || InvitationStatus.Requested
  };
}
