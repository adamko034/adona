export interface UserDto {
  email: string;
  name: string;
  photoUrl: string;
  selectedTeamId: string;
  teams: string[];
  invitationId?: string;
}
