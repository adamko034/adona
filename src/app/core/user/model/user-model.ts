import { TeamInUser } from './team-in-user.model';

export interface User {
  id: string;
  name?: string;
  lastName?: string;
  displayName?: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string;
  selectedTeamId?: string;
  teams?: { [id: string]: TeamInUser };
}
