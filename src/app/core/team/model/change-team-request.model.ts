import { User } from '../../user/model/user.model';

export interface ChangeTeamRequest {
  teamId: string;
  user: User;
  updated: Date;
}
