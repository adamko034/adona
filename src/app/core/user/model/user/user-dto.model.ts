export interface UserDto {
  email: string;
  name: string;
  photoUrl: string;
  selectedTeamId: string;
  personalTeamId: string;
  teams: string[];
  invitationId?: string;
}
