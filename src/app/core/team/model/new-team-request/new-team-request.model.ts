import { NewTeamMember } from 'src/app/core/team/model/new-team-request/new-team-member.model';

export interface NewTeamRequest {
  name: string;
  created: Date;
  members: NewTeamMember[];
}
