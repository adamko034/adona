import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { createAction } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { NewTeamMemberBuilder } from 'src/app/core/team/model/new-team-request/new-team-member.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { teamsActions } from 'src/app/core/team/store/actions';
import { TeamsEffects } from 'src/app/core/team/store/effects/teams/teams.effects';
import { resources } from 'src/app/shared/resources/resources';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Teams Effects', () => {
  let actions$: Actions;
  let effects: TeamsEffects;
  const request: NewTeamRequest = {
    created: new Date(),
    members: [NewTeamMemberBuilder.from('mem1').build(), NewTeamMemberBuilder.from('mem2').withEmail('emai').build()],
    name: 'new team name'
  };

  const user = UserTestBuilder.withDefaultData().build();

  const {
    userFacade,
    teamService,
    errorEffectService,
    guiFacade,
    invitationsFacade,
    resourceService
  } = SpiesBuilder.init()
    .withUserFacade()
    .withTeamService()
    .withErrorEffectService()
    .withInvitationsFacade()
    .withGuiFacade()
    .withResourceService()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamsEffects, provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new TeamsEffects(
      actions$,
      userFacade,
      teamService,
      errorEffectService,
      guiFacade,
      invitationsFacade,
      resourceService
    );

    userFacade.selectUserId.calls.reset();
    userFacade.selectUser.calls.reset();
    teamService.addTeam.calls.reset();
    teamService.loadTeam.calls.reset();
    errorEffectService.createFrom.calls.reset();
    guiFacade.hideLoading.calls.reset();
    guiFacade.showLoading.calls.reset();
    guiFacade.showToastr.calls.reset();
    resourceService.format.calls.reset();
    invitationsFacade.send.calls.reset();
  });

  describe('New Team Requested', () => {
    beforeEach(() => {
      userFacade.selectUser.and.returnValue(of(user));
      guiFacade.showLoading.calls.reset();
      actions$ = cold('--a-a', { a: teamsActions.teams.newTeamRequested({ request }) });
    });

    it('should add team and dispatch actions: New Team Create Success', () => {
      teamService.addTeam.and.returnValue(cold('x', { x: '123' }));

      const expected = cold('--b-b', {
        b: teamsActions.teams.newTeamCreateSuccess({ id: '123', user, request })
      });

      expect(effects.newTeamRequested$).toBeObservable(expected);
      expect(userFacade.selectUser).toHaveBeenCalledTimes(2);
      expect(teamService.addTeam).toHaveBeenCalledTimes(2);
      expect(teamService.addTeam).toHaveBeenCalledWith(user, request);
      expect(guiFacade.showLoading).toHaveBeenCalledTimes(2);
    });

    it('should dispatch New Team Create Failure action when adding team fails', () => {
      teamService.addTeam.and.returnValue(cold('#', {}, { code: 500 }));

      const expected = cold('--b-b', {
        b: teamsActions.teams.newTeamCreateFailure({ error: { errorObj: { code: 500 } } as any })
      });

      expect(effects.newTeamRequested$).toBeObservable(expected);
      expect(teamService.addTeam).toHaveBeenCalledTimes(2);
      expect(guiFacade.showLoading).toHaveBeenCalledTimes(2);
    });
  });

  describe('New Team Create Success', () => {
    it('should send invitation requests, hide loading, show toastr and map to user Team Added action', () => {
      const toastr = ToastrDataBuilder.from('test', ToastrMode.SUCCESS).build();
      const recipients = request.members.filter((m) => !!m.email).map((m) => m.email);
      const expectedInvRequest = {
        recipients,
        sender: user.email,
        teamId: '123',
        teamName: request.name
      };

      resourceService.format.and.returnValue('test');
      const action = teamsActions.teams.newTeamCreateSuccess({ id: '123', request, user });
      actions$ = cold('-aaa', { a: action });

      const expexted = cold('-aaa', { a: userActions.teamAdded({ team: { id: '123', name: request.name } }) });

      expect(effects.newTeamCreateSuccess$).toBeObservable(expexted);
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(3);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(resourceService.format, 3, resources.team.created, request.name);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(invitationsFacade.send, 3, expectedInvRequest);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(guiFacade.showToastr, 3, toastr);
    });

    it('should not send invitation requests if no email recipients, hide loading and show toastr', () => {
      const toastr = ToastrDataBuilder.from('test', ToastrMode.SUCCESS).build();
      resourceService.format.and.returnValue('test');
      const requestWithRecipient = { ...request };
      requestWithRecipient.members = [
        NewTeamMemberBuilder.from('test').build(),
        NewTeamMemberBuilder.from('test2').withEmail(user.email).build()
      ];

      userFacade.selectUser.and.returnValue(of(user));
      const action = teamsActions.teams.newTeamCreateSuccess({ id: '123', request: requestWithRecipient, user });
      actions$ = cold('-aaa', { a: action });

      const expexted = cold('-aaa', {
        a: userActions.teamAdded({ team: { id: '123', name: requestWithRecipient.name } })
      });

      expect(effects.newTeamCreateSuccess$).toBeObservable(expexted);
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(3);
      expect(invitationsFacade.send).not.toHaveBeenCalled();
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        resourceService.format,
        3,
        resources.team.created,
        requestWithRecipient.name
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(guiFacade.showToastr, 3, toastr);
    });
  });

  it('should create error effects', () => {
    errorEffectService.createFrom.and.returnValue(of(null));
    const actions = new Actions(of(createAction('test action')));
    effects = new TeamsEffects(
      actions,
      userFacade,
      teamService,
      errorEffectService,
      guiFacade,
      invitationsFacade,
      resourceService
    );

    expect(errorEffectService.createFrom).toHaveBeenCalledTimes(1);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions, teamsActions.teams.newTeamCreateFailure);
  });
});
