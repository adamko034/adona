import { InvitationStatus } from 'src/app/core/invitations/models/invitation-status.enum';

export interface Invitation {
  id: string;
  teamId: string;
  teamName: string;
  senderEmail: string;
  recipientEmail: string;
  created: Date;
  status: InvitationStatus;
}
