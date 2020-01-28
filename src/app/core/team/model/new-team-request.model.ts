import { TeamMember } from './team-member.model';

export interface NewTeamRequest {
  name: string;
  createdBy: string;
  members?: { [name: string]: TeamMember };
}
