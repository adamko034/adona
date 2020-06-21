import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Dictionary } from '@ngrx/entity';
import { createAction } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { teamActions } from 'src/app/core/store/actions/team.actions';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { TeamEffects } from 'src/app/core/store/effects/team.effects';
import { TeamMembersBuilder } from 'src/app/core/team/model/builders/team-members.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/test/teams-test-data.builder';
import { resources } from 'src/app/shared/resources/resources';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

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
    guiFacade,
    invitationsFacade,
    resourceService,
    teamUtilsService
  } = SpiesBuilder.init()
    .withUserFacade()
    .withTeamService()
    .withTeamFacade()
    .withErrorEffectService()
    .withInvitationsFacade()
    .withGuiFacade()
    .withResourceService()
    .withTeamUtilsService()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamEffects, provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new TeamEffects(
      actions$,
      userFacade,
      teamService,
      teamFacade,
      errorEffectService,
      guiFacade,
      invitationsFacade,
      resourceService,
      teamUtilsService
    );

    userFacade.selectUserId.calls.reset();
    userFacade.selectUser.calls.reset();
    teamService.addTeam.calls.reset();
    teamService.loadTeam.calls.reset();
    teamFacade.selectTeams.calls.reset();
    errorEffectService.createFrom.calls.reset();
    guiFacade.hideLoading.calls.reset();
    guiFacade.showLoading.calls.reset();
    guiFacade.showToastr.calls.reset();
    resourceService.format.calls.reset();
    invitationsFacade.send.calls.reset();
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

      const expected = cold('--(b|)', {
        b: teamActions.newTeamCreateFailure({ error: { errorObj: { code: 500 } } as any })
      });

      expect(effects.newTeamRequested$).toBeObservable(expected);
      expect(teamService.addTeam).toHaveBeenCalledTimes(1);
      expect(guiFacade.showLoading).toHaveBeenCalledTimes(1);
      expect(guiFacade.hideLoading).not.toHaveBeenCalled();
    });
  });

  describe('New Team Create Success', () => {
    it('should send invitation requests, hide loading and show toastr', () => {
      const team = TeamBuilder.from('1', new Date(), user.name, 'team 1').build();
      const toastr = ToastrDataBuilder.from('test', ToastrMode.SUCCESS).build();
      const recipients = ['user@example.com', 'user2@example.com'];
      const expectedInvRequest = {
        recipients,
        sender: user.email,
        teamId: team.id,
        teamName: team.name
      };

      teamUtilsService.getMembersEmailsWithout.and.returnValue(recipients);
      resourceService.format.and.returnValue('test');
      userFacade.selectUser.and.returnValue(of(user));

      const action = teamActions.newTeamCreateSuccess({ team });
      actions$ = cold('-aaa', { a: action });

      expect(effects.newTeamCreateSuccess$).toBeObservable(cold('-aaa', { a: action }));
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(3);
      expect(userFacade.selectUser).toHaveBeenCalledTimes(3);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(resourceService.format, 3, resources.team.created, team.name);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(invitationsFacade.send, 3, expectedInvRequest);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(guiFacade.showToastr, 3, toastr);
    });

    it('should not send invitation requests if no recipients, hide loading and show toastr', () => {
      const team = TeamBuilder.from('1', new Date(), user.name, 'team 1').build();
      const toastr = ToastrDataBuilder.from('test', ToastrMode.SUCCESS).build();
      teamUtilsService.getMembersEmailsWithout.and.returnValue([]);

      resourceService.format.and.returnValue('test');

      userFacade.selectUser.and.returnValue(of(user));
      const action = teamActions.newTeamCreateSuccess({ team });
      actions$ = cold('aa-a', { a: action });

      expect(effects.newTeamCreateSuccess$).toBeObservable(cold('aa-a', { a: action }));
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(3);
      expect(userFacade.selectUser).toHaveBeenCalledTimes(3);
      expect(invitationsFacade.send).not.toHaveBeenCalled();
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(resourceService.format, 3, resources.team.created, team.name);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(guiFacade.showToastr, 3, toastr);
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

      actions$ = hot('--a-a', { a: teamActions.loadTeamRequested({ id: teamToLoad.id }) });
      const expected = cold('--b-b', { b: teamActions.loadTeamFailure({ error: { errorObj: err } } as any) });
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
      const expected = cold('--(b|)', { b: teamActions.loadTeamFailure({ error: { errorObj: error } } as any) });

      expect(effects.loadSelectedTeamRequested$).toBeObservable(expected);
      expect(teamService.loadTeam).toHaveBeenCalledTimes(1);
      expect(teamService.loadTeam).toHaveBeenCalledWith(teamToLoad.id);
    });
  });

  it('should create error effects', () => {
    errorEffectService.createFrom.and.returnValue(of(null));
    const actions = new Actions(of(createAction('test action')));
    effects = new TeamEffects(
      actions,
      userFacade,
      teamService,
      teamFacade,
      errorEffectService,
      guiFacade,
      invitationsFacade,
      resourceService,
      teamUtilsService
    );

    expect(errorEffectService.createFrom).toHaveBeenCalledTimes(2);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions, teamActions.loadTeamFailure);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions, teamActions.newTeamCreateFailure);
  });
});
