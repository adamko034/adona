import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { teamActions } from '../store/actions/team.actions';
import { TeamState } from '../store/reducers/team/team.reducer';
import { teamQueries } from '../store/selectors/team.selectors';
import { TeamBuilder } from './model/builders/team.builder';
import { NewTeamRequest } from './model/new-team-request.model';
import { Team } from './model/team.model';
import { TeamFacade } from './team.facade';
import { TeamsTestDataBuilder } from './utils/test/teams-test-data.builder';

describe('Team Facade', () => {
  let store: MockStore<TeamState>;
  let facade: TeamFacade;
  let dispatchSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.get<Store<TeamState>>(Store);
    dispatchSpy = spyOn(store, 'dispatch');
    dispatchSpy.calls.reset();

    facade = new TeamFacade(store);
  });

  describe('Load Selected Team', () => {
    it('should dispatch Load Selected Team action', () => {
      facade.loadSelectedTeam();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(teamActions.loadSelectedTeamRequested());
    });
  });

  describe('Load Team', () => {
    it('should dispatch Load Team Requested action', () => {
      facade.loadTeam('123');

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(teamActions.loadTeamRequested({ id: '123' }));
    });
  });

  describe('Add Team', () => {
    it('should dispatch New Team Requested action', () => {
      const request: NewTeamRequest = {
        created: new Date(),
        createdBy: 'test',
        name: 'test name'
      };

      facade.addTeam(request);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(teamActions.newTeamRequested({ request }));
    });
  });

  describe('Select Teams', () => {
    it('should return teams', () => {
      const teams: Dictionary<Team> = TeamsTestDataBuilder.withDefaultData().build();
      store.overrideSelector(teamQueries.selectTeams, teams);

      const expected = hot('x', { x: teams });

      const result = facade.selectTeams();

      expect(result).toBeObservable(expected);
    });
  });

  describe('Select Selected Team', () => {
    it('should return selected team', () => {
      const team = TeamBuilder.from('123', new Date(), 'test user', 'test name').build();
      store.overrideSelector(teamQueries.selectSelectedTeam, team);

      const expected = hot('x', { x: team });

      const result = facade.selectSelectedTeam();

      expect(result).toBeObservable(expected);
    });
  });
});