import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Dictionary } from '@ngrx/entity';
import { createAction } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { SpiesBuilder } from '../../../utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from '../../../utils/testUtils/builders/user-test-builder';
import { DefaultErrorType } from '../../error/enum/default-error-type.enum';
import { TeamMembersBuilder } from '../../team/model/builders/team-members.builder';
import { TeamBuilder } from '../../team/model/builders/team.builder';
import { NewTeamRequest } from '../../team/model/new-team-request.model';
import { Team } from '../../team/model/team.model';
import { TeamsTestDataBuilder } from '../../team/utils/test/teams-test-data.builder';
import { teamActions } from '../actions/team.actions';
import { userActions } from '../actions/user.actions';
import { TeamEffects } from './team.effects';

describe('Team Effects', () => {
  let actions$: Actions;
  let effects: TeamEffects;
  let newTeamRequest: NewTeamRequest;

  const user = UserTestBuilder.withDefaultData().build();

  const {
    userFacade,
    teamService,
    teamFacade,
    errorEffectService,
    guiFacade
  } = SpiesBuilder.init()
    .withUserFacade()
    .withTeamService()
    .withTeamFacade()
    .withErrorEffectService()
    .withGuiFacade()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamEffects, provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new TeamEffects(actions$, userFacade, teamService, teamFacade, errorEffectService, guiFacade);

    userFacade.selectUserId.calls.reset();
    teamService.addTeam.calls.reset();
    teamService.loadTeam.calls.reset();
    teamFacade.selectTeams.calls.reset();
    errorEffectService.createFrom.calls.reset();
    guiFacade.hideLoading.calls.reset();
    guiFacade.showLoading.calls.reset();
  });

  describe('New Team Requested', () => {
    beforeEach(() => {
      newTeamRequest = {
        created: new Date(),
        createdBy: 'test user',
        members: TeamMembersBuilder.from()
          .withMember('test user', 'photourl')
          .withMember('test user 2', 'photourl')
          .build(),
        name: 'new team name'
      };

      userFacade.selectUserId.and.returnValue(of(user.id));
      guiFacade.hideLoading.calls.reset();
      guiFacade.showLoading.calls.reset();

      actions$ = hot('--a', { a: teamActions.newTeamRequested({ request: newTeamRequest }) });
    });

    it('should add team and dispatch actions: New Team Created, Team Added, Changed Team Success', () => {
      const team = TeamBuilder.from(
        '123',
        newTeamRequest.created,
        newTeamRequest.createdBy,
        newTeamRequest.name
      ).build();

      teamService.addTeam.and.returnValue(cold('x', { x: team }));

      const expected = cold('--(bcd)', {
        b: teamActions.newTeamCreateSuccess({ team }),
        c: userActions.teamAdded({ id: team.id, name: team.name, updated: team.created }),
        d: userActions.changeTeamSuccess({ teamId: team.id, updated: team.created })
      });

      expect(effects.newTeamRequested$).toBeObservable(expected);
      expect(userFacade.selectUserId).toHaveBeenCalledTimes(1);
      expect(teamService.addTeam).toHaveBeenCalledTimes(1);
      expect(teamService.addTeam).toHaveBeenCalledWith(newTeamRequest, user.id);
      expect(guiFacade.showLoading).toHaveBeenCalledTimes(1);
    });

    it('should dispatch New Team Create Failure action when adding team fails', () => {
      teamService.addTeam.and.returnValue(cold('#', {}, { code: 500 }));

      const expected = cold('--(b|)', { b: teamActions.newTeamCreateFailure({ error: { errorObj: { code: 500 } } }) });

      expect(effects.newTeamRequested$).toBeObservable(expected);
      expect(teamService.addTeam).toHaveBeenCalledTimes(1);
      expect(guiFacade.showLoading).toHaveBeenCalledTimes(1);
      expect(guiFacade.hideLoading).not.toHaveBeenCalled();
    });
  });

  describe('New Team Create Success', () => {
    it('should hide loading', () => {
      const action = teamActions.newTeamCreateSuccess({ team: TeamsTestDataBuilder.withDefaultData().build()[0] });
      actions$ = cold('aa-a', { a: action });

      expect(effects.newTeamCreateSuccess$).toBeObservable(cold('aa-a', { a: action }));
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(3);
    });
  });

  describe('Load Team Requested', () => {
    let teams: Dictionary<Team>;
    beforeEach(() => {
      teams = TeamsTestDataBuilder.withDefaultData().build();
    });

    it('should load team if it is not already loaded and dispatch Load Team Success action', () => {
      const teamToLoad = TeamBuilder.from('4321', new Date(), 'test user', 'team to load').build();

      teamFacade.selectTeams.and.returnValue(of(teams));
      teamService.loadTeam.and.returnValue(cold('x', { x: teamToLoad }));

      actions$ = hot('--a', { a: teamActions.loadTeamRequested({ id: teamToLoad.id }) });
      const expected = cold('--b', { b: teamActions.loadTeamSuccess({ team: teamToLoad }) });
      expect(effects.loadTeamRequested$).toBeObservable(expected);
    });

    it('should not load a team if it is already stored', () => {
      const teamToLoad = teams[TeamsTestDataBuilder.firstTeamId];

      teamFacade.selectTeams.and.returnValue(of(teams));

      actions$ = hot('--a', { a: teamActions.loadTeamRequested({ id: teamToLoad.id }) });
      const expected = cold('---');
      expect(effects.loadTeamRequested$).toBeObservable(expected);
    });

    it('should dispatch Load Team Failure action if loading fails', () => {
      const teamToLoad = TeamBuilder.from('4321', new Date(), 'test user', 'team to load').build();
      const err = { code: 500 };

      teamFacade.selectTeams.and.returnValue(of(teams));
      teamService.loadTeam.and.returnValue(cold('#', {}, err));

      actions$ = hot('--a', { a: teamActions.loadTeamRequested({ id: teamToLoad.id }) });
      const expected = cold('--(b|)', { b: teamActions.loadTeamFailure({ error: { errorObj: err } }) });
      expect(effects.loadTeamRequested$).toBeObservable(expected);
    });
  });

  describe('Load Selected Team Requested', () => {
    const teams: Dictionary<Team> = TeamsTestDataBuilder.withDefaultData().build();

    it('should load team if user has selected team and it is not already stored and dipatch Load Team Success action', () => {
      const teamToLoad = TeamBuilder.from('newTeamId', new Date(), 'test user', 'new team').build();
      const user2 = UserTestBuilder.withDefaultData().withSelectedTeamId(teamToLoad.id).build();

      userFacade.selectUser.and.returnValue(of(user2));
      teamFacade.selectTeams.and.returnValue(of(teams));
      teamService.loadTeam.and.returnValue(cold('x', { x: teamToLoad }));

      actions$ = hot('--a', { a: teamActions.loadSelectedTeamRequested() });
      const expected = cold('--b', { b: teamActions.loadTeamSuccess({ team: teamToLoad }) });

      expect(effects.loadSelectedTeamRequested$).toBeObservable(expected);
      expect(teamService.loadTeam).toHaveBeenCalledTimes(1);
      expect(teamService.loadTeam).toHaveBeenCalledWith(teamToLoad.id);
    });

    it('should not load team if user does not have selected team', () => {
      const user2 = UserTestBuilder.withDefaultData().withSelectedTeamId(null).build();

      userFacade.selectUser.and.returnValue(of(user2));
      teamFacade.selectTeams.and.returnValue(of(teams));

      actions$ = hot('--a', { a: teamActions.loadSelectedTeamRequested() });
      const expected = cold('---');

      expect(effects.loadSelectedTeamRequested$).toBeObservable(expected);
      expect(teamService.loadTeam).toHaveBeenCalledTimes(0);
    });

    it('should not load team if user has selected team and the team is already stored', () => {
      const user2 = UserTestBuilder.withDefaultData().withSelectedTeamId(TeamsTestDataBuilder.firstTeamId).build();

      userFacade.selectUser.and.returnValue(of(user2));
      teamFacade.selectTeams.and.returnValue(of(teams));

      actions$ = hot('--a', { a: teamActions.loadSelectedTeamRequested() });
      const expected = cold('---');

      expect(effects.loadSelectedTeamRequested$).toBeObservable(expected);
      expect(teamService.loadTeam).toHaveBeenCalledTimes(0);
    });

    it('should dispatch Load Team Failure if effect fails', () => {
      const teamToLoad = TeamBuilder.from('newTeamId', new Date(), 'test user', 'new team').build();
      const user2 = UserTestBuilder.withDefaultData().withSelectedTeamId(teamToLoad.id).build();
      const error = { code: 500 };

      userFacade.selectUser.and.returnValue(of(user2));
      teamFacade.selectTeams.and.returnValue(of(teams));
      teamService.loadTeam.and.returnValue(cold('#', {}, error));

      actions$ = hot('--a', { a: teamActions.loadSelectedTeamRequested() });
      const expected = cold('--(b|)', { b: teamActions.loadTeamFailure({ error: { errorObj: error } }) });

      expect(effects.loadSelectedTeamRequested$).toBeObservable(expected);
      expect(teamService.loadTeam).toHaveBeenCalledTimes(1);
      expect(teamService.loadTeam).toHaveBeenCalledWith(teamToLoad.id);
    });
  });

  it('should create error effects', () => {
    errorEffectService.createFrom.and.returnValue(of(null));
    const actions = new Actions(of(createAction('test action')));
    effects = new TeamEffects(actions, userFacade, teamService, teamFacade, errorEffectService, guiFacade);

    expect(errorEffectService.createFrom).toHaveBeenCalledTimes(2);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(
      actions,
      teamActions.loadTeamFailure,
      DefaultErrorType.ApiGet
    );
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(
      actions,
      teamActions.newTeamCreateFailure,
      DefaultErrorType.ApiPost
    );
  });
});
