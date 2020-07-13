import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { NewTeamMemberBuilder } from 'src/app/core/team/model/requests/new-team/new-team-member.builder';
import { TeamNameUpdateRequestBuilder } from 'src/app/core/team/model/requests/update-name/team-name-update-request.build';
import { teamsActions } from 'src/app/core/team/store/actions';
import { TeamEffects } from 'src/app/core/team/store/effects/team/team.effects';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/jasmine/teams-test-data.builder';
import { resources } from 'src/app/shared/resources/resources';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Team Effects', () => {
  let effects: TeamEffects;
  let actions$: Actions;

  const user = UserTestBuilder.withDefaultData().build();
  const newTeamRequest = {
    created: new Date(),
    members: [NewTeamMemberBuilder.from('mem1').build(), NewTeamMemberBuilder.from('mem2').withEmail('emai').build()],
    name: 'new team name'
  };

  const {
    teamService,
    errorEffectService,
    guiFacade,
    apiRequestsFacade,
    userFacade,
    invitationsFacade,
    resourceService
  } = SpiesBuilder.init()
    .withGuiFacade()
    .withTeamService()
    .withErrorEffectService()
    .withApiRequestsFacade()
    .withUserFacade()
    .withInvitationsFacade()
    .withResourceService()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new TeamEffects(
      actions$,
      teamService,
      errorEffectService,
      guiFacade,
      apiRequestsFacade,
      userFacade,
      invitationsFacade,
      resourceService
    );

    apiRequestsFacade.startRequest.calls.reset();
    apiRequestsFacade.successRequest.calls.reset();
    guiFacade.showLoading.calls.reset();
    guiFacade.hideLoading.calls.reset();
    guiFacade.showToastr.calls.reset();
    userFacade.selectUser.calls.reset();
    teamService.addTeam.calls.reset();
    resourceService.format.calls.reset();
    invitationsFacade.send.calls.reset();
    teamService.updateName.calls.reset();
  });

  describe('Load Team Requested', () => {
    beforeEach(() => {
      teamService.getTeam.calls.reset();
    });

    it('should call service and map to Load Selected Team Success action', () => {
      const team = TeamsTestDataBuilder.withDefaultData().buildOne();
      teamService.getTeam.and.returnValue(cold('a', { a: team }));

      actions$ = cold('--a-a', { a: teamsActions.team.loadTeamRequested({ id: team.id }) });
      const expected = cold('--a-a', { a: teamsActions.team.loadTeamSuccess({ team }) });

      expect(effects.loadTeamRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.getTeam, 2, team.id);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.loadTeam);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.successRequest, 2, apiRequestIds.loadTeam);
    });

    it('should map to Load Selected Team Failure action when service fails', () => {
      teamService.getTeam.and.returnValue(cold('#', null, { testCode: '500' }));
      const error = ErrorBuilder.from()
        .withErrorObject({ testCode: '500' })
        .withFirebaseError(apiRequestIds.loadTeam, '')
        .build();
      actions$ = cold('--a-a', { a: teamsActions.team.loadTeamRequested({ id: '123' }) });

      const expected = cold('--a-a', { a: teamsActions.team.loadTeamFailure({ error }) });

      expect(effects.loadTeamRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.getTeam, 2, '123');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.loadTeam);
      expect(apiRequestsFacade.successRequest).not.toHaveBeenCalled();
    });
  });

  describe('New Team Requested', () => {
    beforeEach(() => {
      userFacade.selectUser.and.returnValue(of(user));
      guiFacade.showLoading.calls.reset();
      actions$ = cold('--a-a', { a: teamsActions.team.newTeamRequested({ request: newTeamRequest }) });
    });

    it('should add team and dispatch actions: New Team Create Success', () => {
      teamService.addTeam.and.returnValue(cold('x', { x: '123' }));

      const expected = cold('--b-b', {
        b: teamsActions.team.newTeamCreateSuccess({ id: '123', user, request: newTeamRequest })
      });

      expect(effects.newTeamRequested$).toBeObservable(expected);
      expect(userFacade.selectUser).toHaveBeenCalledTimes(2);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.addTeam, 2, user, newTeamRequest);
      expect(guiFacade.showLoading).toHaveBeenCalledTimes(2);
    });

    it('should dispatch New Team Create Failure action when adding team fails', () => {
      teamService.addTeam.and.returnValue(cold('#', {}, { code: 500 }));

      const expected = cold('--b-b', {
        b: teamsActions.team.newTeamCreateFailure({ error: { errorObj: { code: 500 } } as any })
      });

      expect(effects.newTeamRequested$).toBeObservable(expected);
      expect(teamService.addTeam).toHaveBeenCalledTimes(2);
      expect(guiFacade.showLoading).toHaveBeenCalledTimes(2);
    });
  });

  describe('New Team Create Success', () => {
    it('should send invitation requests, hide loading, show toastr and map to user Team Added action', () => {
      const toastr = ToastrDataBuilder.from('test', ToastrMode.SUCCESS).build();
      const recipients = newTeamRequest.members.filter((m) => !!m.email).map((m) => m.email);
      const expectedInvRequest = {
        recipients,
        sender: user.email,
        teamId: '123',
        teamName: newTeamRequest.name
      };

      resourceService.format.and.returnValue('test');
      const action = teamsActions.team.newTeamCreateSuccess({ id: '123', request: newTeamRequest, user });
      actions$ = cold('-aaa', { a: action });

      const expexted = cold('-aaa', { a: userActions.teamAdded({ team: { id: '123', name: newTeamRequest.name } }) });

      expect(effects.newTeamCreateSuccess$).toBeObservable(expexted);
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(3);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        resourceService.format,
        3,
        resources.team.created,
        newTeamRequest.name
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(invitationsFacade.send, 3, expectedInvRequest);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(guiFacade.showToastr, 3, toastr);
    });

    it('should not send invitation requests if no email recipients, hide loading and show toastr', () => {
      const toastr = ToastrDataBuilder.from('test', ToastrMode.SUCCESS).build();
      resourceService.format.and.returnValue('test');
      const requestWithRecipient = { ...newTeamRequest };
      requestWithRecipient.members = [
        NewTeamMemberBuilder.from('test').build(),
        NewTeamMemberBuilder.from('test2').withEmail(user.email).build()
      ];

      userFacade.selectUser.and.returnValue(of(user));
      const action = teamsActions.team.newTeamCreateSuccess({ id: '123', request: requestWithRecipient, user });
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

  describe('Update Team Name Requested', () => {
    it('should call service and map to Update Team Name Success action', () => {
      const request = TeamNameUpdateRequestBuilder.from('1', 'team 1').build();
      actions$ = cold('--a--a', { a: teamsActions.team.updateNameRequested({ request }) });
      teamService.updateName.and.returnValue(cold('b', { b: undefined }));

      expect(effects.updateTeamNameRequested$).toBeObservable(
        cold('--a--a', { a: teamsActions.team.updateNameSuccess({ teamId: request.id, newName: request.name }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.updateTeamName);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        apiRequestsFacade.successRequest,
        2,
        apiRequestIds.updateTeamName
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.updateName, 2, request.id, request.name);
    });

    it('should map to Update Team Name Failure action when service fails', () => {
      const request = TeamNameUpdateRequestBuilder.from('1', 'team 1').build();
      actions$ = cold('--a--a', { a: teamsActions.team.updateNameRequested({ request }) });

      teamService.updateName.and.returnValue(cold('#', null, { test: '500' }));
      const error = ErrorBuilder.from()
        .withErrorObject({ test: '500' })
        .withFirebaseError(apiRequestIds.updateTeamName, '')
        .build();

      expect(effects.updateTeamNameRequested$).toBeObservable(
        cold('--a--a', { a: teamsActions.team.updateNameFailure({ error }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.updateTeamName);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.updateName, 2, request.id, request.name);
    });
  });

  it('should create failures effects', () => {
    errorEffectService.createFrom.calls.reset();
    effects = new TeamEffects(
      actions$,
      teamService,
      errorEffectService,
      guiFacade,
      apiRequestsFacade,
      userFacade,
      invitationsFacade,
      resourceService
    );
    expect(errorEffectService.createFrom).toHaveBeenCalledTimes(3);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions$, teamsActions.team.loadTeamFailure);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions$, teamsActions.team.newTeamCreateFailure);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions$, teamsActions.team.updateNameFailure);
  });
});
