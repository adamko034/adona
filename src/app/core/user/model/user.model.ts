import { UserTeam } from './user-team.model';

export interface User {
  id: string;
  email: string;
  name: string;
  selectedTeamId?: string;
  teams?: UserTeam[];
  photoUrl?: string;
}
