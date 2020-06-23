import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@ngrx/entity';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamMembersBuilder } from 'src/app/core/team/model/team-member/team-members.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { teamsActions } from 'src/app/core/team/store/actions';
import { TeamsState } from 'src/app/core/team/store/reducers/teams.reducer';
import { teamsQueries } from 'src/app/core/team/store/selectors/teams.selectors';
import { TeamFacade } from 'src/app/core/team/teams.facade';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/jasmine/teams-test-data.builder';

describe('Team Facade', () => {
  let store: MockStore<TeamsState>;
  let facade: TeamFacade;
  let dispatchSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    dispatchSpy.calls.reset();

    facade = new TeamFacade(store);
  });

  describe('Load Selected Team', () => {
    it('should dispatch Load Selected Team Requested action', () => {
      facade.loadSelectedTeam('123');

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(teamsActions.selectedTeam.loadSelectedTeamRequested({ id: '123' }));
    });
  });

  describe('Load Team', () => {
    it('should dispatch Load Team Requested action', () => {
      facade.loadTeam('123');

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(teamsActions.teams.loadTeamRequested({ id: '123' }));
    });
  });

  describe('Add Team', () => {
    it('should dispatch New Team Requested action', () => {
      const request: NewTeamRequest = {
        created: new Date(),
        createdBy: 'test',
        name: 'test name',
        members: TeamMembersBuilder.from().withMember('testUser', 'url').build()
      };

      facade.addTeam(request);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(teamsActions.teams.newTeamRequested({ request }));
    });
  });

  describe('Select Teams', () => {
    it('should return teams', () => {
      const teams: Dictionary<Team> = TeamsTestDataBuilder.withDefaultData().build();
      store.overrideSelector(teamsQueries.selectTeams, teams);

      const expected = hot('x', { x: teams });

      const result = facade.selectTeams();

      expect(result).toBeObservable(expected);
    });
  });

  describe('Select Selected Team', () => {
    it('should return selected team', () => {
      const team = TeamBuilder.from('123', new Date(), 'test user', 'test name').build();
      store.overrideSelector(teamsQueries.selectSelectedTeam, team);
      expect(facade.selectSelectedTeam()).toBeObservable(cold('x', { x: team }));
    });
  });
});
