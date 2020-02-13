import { TeamMember } from './team-member.model';

export interface NewTeamRequest {
  name: string;
  createdBy: string;
  created: Date;
  members?: { [name: string]: TeamMember };
}
