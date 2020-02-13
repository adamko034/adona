import { UserTeam } from './user-team.model';

export interface User {
  id: string;
  name: string;
  selectedTeamId?: string;
  teams?: UserTeam[];
}
