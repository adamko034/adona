import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { teamsActions } from 'src/app/core/team/store/actions';
import { teamQueries } from 'src/app/core/team/store/selectors/team.selectors';
import { TeamFacade } from 'src/app/core/team/teams.facade';

describe('Team Facade', () => {
  let store: MockStore;
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

  describe('Load Team', () => {
    it('should dispatch Load Selected Team Requested action', () => {
      facade.loadTeam('123');

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(teamsActions.team.loadTeamRequested({ id: '123' }));
    });
  });

  describe('Add Team', () => {
    it('should dispatch New Team Requested action', () => {
      const request: NewTeamRequest = {
        created: new Date(),
        name: 'test name',
        members: []
      };

      facade.addTeam(request);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(teamsActions.teams.newTeamRequested({ request }));
    });
  });

  describe('Select Selected Team', () => {
    it('should return selected team', () => {
      const team = TeamBuilder.from('123', new Date(), 'test user', 'test name', []).build();
      store.overrideSelector(teamQueries.selectTeam, team);
      expect(facade.selectTeam()).toBeObservable(cold('x', { x: team }));
    });
  });
});
