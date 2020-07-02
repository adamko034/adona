import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';

export interface Team {
  id: string;
  created: Date;
  createdBy: string;
  name: string;
  members: TeamMember[];
}
