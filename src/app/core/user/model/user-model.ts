import { UserTeam } from './user-team.model';

export interface User {
  id: string;
  name?: string;
  lastName?: string;
  displayName?: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string;
  teams?: UserTeam[];
}
