import { UserTeam } from 'src/app/core/user/model/user-team/user-team.model';

export interface User {
  id: string;
  email: string;
  name: string;
  teams: UserTeam[];
  selectedTeamId?: string;
  photoUrl?: string;
  invitationId?: string;
}
