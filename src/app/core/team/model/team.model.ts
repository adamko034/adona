import { TeamMember } from './team-member.model';

export interface Team {
  id: string;
  created: Date;
  createdBy: string;
  name: string;
  members?: { [name: string]: TeamMember };
}
