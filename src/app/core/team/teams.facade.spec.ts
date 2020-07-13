import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { NewTeamRequest } from 'src/app/core/team/model/requests/new-team/new-team-request.model';
import { TeamNameUpdateRequestBuilder } from 'src/app/core/team/model/requests/update-name/team-name-update-request.build';
import { TeamNameUpdateRequest } from 'src/app/core/team/model/requests/update-name/team-name-update-request.model';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { teamsActions } from 'src/app/core/team/store/actions';
import { teamQueries } from 'src/app/core/team/store/selectors/teams.selectors';
import { TeamsFacade } from 'src/app/core/team/teams.facade';

describe('Team Facade', () => {
  let store: MockStore;
  let facade: TeamsFacade;
  let dispatchSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    dispatchSpy.calls.reset();

    facade = new TeamsFacade(store);
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
      expect(dispatchSpy).toHaveBeenCalledWith(teamsActions.team.newTeamRequested({ request }));
    });
  });

  describe('Select Selected Team', () => {
    it('should return selected team', () => {
      const team = TeamBuilder.from('123', new Date(), 'test user', 'test name', []).build();
      store.overrideSelector(teamQueries.selectSelected, team);
      expect(facade.selectSelectedTeam()).toBeObservable(cold('x', { x: team }));
    });
  });

  describe('Select Team', () => {
    it('should return team', () => {
      const team = TeamBuilder.from('123', new Date(), 'test user', 'test name', []).build();
      store.overrideSelector(teamQueries.selectOne, team);
      expect(facade.selectTeam('123')).toBeObservable(cold('x', { x: team }));
    });
  });

  describe('Select Teams', () => {
    it('should return teams from selector', (done) => {
      const teams = [
        TeamBuilder.from('1', new Date(), 'user 1', 'team ', []).build(),
        TeamBuilder.from('2', new Date(), 'user 1', 'team 2', []).build()
      ];
      store.overrideSelector(teamQueries.selectAll, teams);

      facade.selectTeams().subscribe((actual) => {
        expect(actual).toEqual(teams);
        done();
      });
    });
  });

  describe('Load Teams', () => {
    it('should dispatch Load Teams Requested action', () => {
      facade.loadTeams();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(teamsActions.teams.loadTeamsRequested());
    });
  });

  describe('Change Team Name', () => {
    it('should dispatch Change Team Name Requested action', () => {
      const request: TeamNameUpdateRequest = TeamNameUpdateRequestBuilder.from('1', 'team 2').build();
      facade.changeTeamName(request);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(teamsActions.team.updateNameRequested({ request }));
    });
  });
});
