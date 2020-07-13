import { NewTeamMember } from 'src/app/core/team/model/requests/new-team/new-team-member.model';

export interface NewTeamRequest {
  name: string;
  created: Date;
  members: NewTeamMember[];
}
