import { TeamMemberBuilder } from 'src/app/core/team/model/team-member/team-member.builder';
import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
import { UserBuilder } from 'src/app/core/user/model/builders/user.builder';

describe('Team Member Builder', () => {
  const userName = 'testUser1';
  it('should use default photo url', () => {
    expect(TeamMemberBuilder.from(userName).build()).toEqual(
      createTeamMember(userName, UserBuilder.defaultPhotoUrl, undefined)
    );
  });

  it('should build with photo url', () => {
    const photoUrl = 'local/test';
    expect(TeamMemberBuilder.from(userName).withPhotoUrl(photoUrl).build()).toEqual(
      createTeamMember(userName, photoUrl, undefined)
    );
  });

  it('should build with email address', () => {
    const email = 'user@example.com';
    expect(TeamMemberBuilder.from(userName).withEmailAddress(email).build()).toEqual(
      createTeamMember(userName, UserBuilder.defaultPhotoUrl, email)
    );
  });
});

function createTeamMember(name: string, photoUrl: string, email?: string): TeamMember {
  return !!email ? { name, photoUrl, email } : { name, photoUrl };
}
