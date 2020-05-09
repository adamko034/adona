import { NewTeamRequestBuilder } from 'src/app/core/team/model/new-team-request/new-team-request.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';

const mockDate = new Date();
const teamName = 'newTeam1';
const createdBy = 'testUser';
const teamMembers: { [key: string]: TeamMember } = {
  ['testUser']: { name: 'testUser' }
};

describe('New Team Request Builder', () => {
  beforeAll(() => {
    jasmine.clock().mockDate(mockDate);
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  it('should create New Team Request', () => {
    expect(NewTeamRequestBuilder.from(teamName, createdBy, teamMembers).build()).toEqual(createRequest());
  });
});

function createRequest(): NewTeamRequest {
  return { name: teamName, members: teamMembers, createdBy, created: mockDate };
}
