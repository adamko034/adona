import { UserTeam } from './user-team.model';

export interface User {
  id: string;
  name: string;
  email: string;
  selectedTeamId?: string;
  teams?: UserTeam[];
}
