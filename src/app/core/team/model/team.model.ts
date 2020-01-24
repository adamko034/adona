import { TeamMember } from './team-member.model';

export interface Team {
  id: string;
  createdBy: string;
  name: string;
  members?: { [name: string]: TeamMember };
}
