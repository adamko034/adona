import { RouterLocatorService } from 'src/app/core/router/services/router-locator/router-locator.service';

describe('Router Locator Service', () => {
  let service: RouterLocatorService;

  beforeEach(() => {
    service = new RouterLocatorService();
  });

  describe('Is Team Details Page', () => {
    [
      { teamId: '1', route: { route: 'unkown page', params: { id: '1' } }, expected: false, description: 'wrong page' },
      {
        teamId: '1',
        route: { route: '/setttings/account', params: { id: '1' } },
        expected: false,
        description: 'wrong settings page'
      },
      { teamId: '1', route: { route: '/settings/teams', params: null }, expected: false, description: 'null params' },
      {
        teamId: '1',
        route: { route: '/settings/teams', params: { test: 'test' } },
        expected: false,
        description: 'missing id param'
      },
      {
        teamId: '1',
        route: { route: '/settings/teams', params: { id: '2' } },
        expected: false,
        description: 'incorrect id'
      },
      {
        teamId: '1',
        route: { route: '/settings/teams', params: { id: '1' } },
        expected: true,
        description: 'correct page'
      }
    ].forEach((input) => {
      it(`should return ${input.expected} when ${input.description}`, () => {
        expect(service.isTeamDetailsPage(input.teamId, input.route)).toEqual(input.expected);
      });
    });
  });
});
