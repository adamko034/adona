import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';

export interface NewTeamRequest {
  name: string;
  createdBy: string;
  created: Date;
  members: { [name: string]: TeamMember };
}
