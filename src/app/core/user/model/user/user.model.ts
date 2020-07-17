import { UserTeam } from 'src/app/core/user/model/user-team/user-team.model';

export interface User {
  id: string;
  email: string;
  name: string;
  teams: UserTeam[];
  personalTeamId: string;
  selectedTeamId?: string;
  photoUrl?: string;
  invitationId?: string;
}
