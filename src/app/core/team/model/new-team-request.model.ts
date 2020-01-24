import { TeamMember } from './team-member.model';

export interface NewTeamRequest {
  name: string;
  default: boolean;
  createdBy: string;
  members?: { [name: string]: TeamMember };
}
