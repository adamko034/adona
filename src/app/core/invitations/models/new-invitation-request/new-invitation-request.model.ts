import { Team } from 'src/app/core/team/model/team.model';
import { User } from 'src/app/core/user/model/user.model';

export interface NewInvitationRequest {
  sender: User;
  team: Team;
}
