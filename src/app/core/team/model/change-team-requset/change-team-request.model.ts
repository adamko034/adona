import { User } from 'src/app/core/user/model/user.model';

export interface ChangeTeamRequest {
  teamId: string;
  user: User;
  updated: Date;
}
