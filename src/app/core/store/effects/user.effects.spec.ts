import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { createAction } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { ToastrDataBuilder } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.builder';
import { ToastrMode } from 'src/app/core/gui/model/toastr/toastr-mode/toastr-mode.enum';
import { InvitationStatus } from 'src/app/core/invitations/models/invitation-status.enum';
import { InvitationBuilder } from 'src/app/core/invitations/models/invitation/invitation.builder';
import { Invitation } from 'src/app/core/invitations/models/invitation/invitation.model';
import { InvitationsService } from 'src/app/core/invitations/services/invitations-service/invitations.service';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { userActions } from 'src/app/core/store/actions/user.actions';
import { UserEffects } from 'src/app/core/store/effects/user.effects';
import { ChangeTeamRequest } from 'src/app/core/team/model/change-team-requset/change-team-request.model';
import { TeamFacade } from 'src/app/core/team/teams.facade';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserService } from 'src/app/core/user/services/user.service';
import { resources } from 'src/app/shared/resources/resources';
import { ResourceService } from 'src/app/shared/resources/services/resource.service';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('User Effects', () => {
  let actions$: Actions;
  let effects: UserEffects;
  const mockDate = new Date();

  const user = UserTestBuilder.withDefaultData().build();
  let invitation: Invitation;

  const {
    userService,
    errorEffectService,
    guiFacade,
    invitationsService,
    resourceService,
    teamFacade
  } = SpiesBuilder.init()
    .withUserService()
    .withInvitationsService()
    .withResourceService()
    .withErrorEffectService()
    .withGuiFacade()
    .withTeamFacade()
    .build();

  beforeAll(() => {
    jasmine.clock().mockDate(mockDate);
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: UserService, useValue: userService },
        { provide: ErrorEffectService, useValue: errorEffectService },
        { provide: GuiFacade, useValue: guiFacade },
        { provide: InvitationsService, useValue: invitationsService },
        { provide: ResourceService, useValue: resourceService },
        { provide: TeamFacade, useValue: teamFacade }
      ]
    });

    effects = TestBed.inject<UserEffects>(UserEffects);

    userService.loadUser.calls.reset();
    userService.changeTeam.calls.reset();
    userService.updateName.calls.reset();
    guiFacade.showLoading.calls.reset();
    guiFacade.hideLoading.calls.reset();
    guiFacade.showToastr.calls.reset();
    teamFacade.loadTeam.calls.reset();

    invitation = InvitationBuilder.from('123', 'user@example.com', 'userS@example.com', '1', 'team 1')
      .withStatus(InvitationStatus.Sent)
      .build();
  });

  describe('Load User Requested', () => {
    it('should load user and dispatch Load User Success action', () => {
      userService.loadUser.and.returnValue(cold('x', { x: user }));

      actions$ = hot('--a', { a: userActions.loadUserRequested() });
      const expected = cold('--b', { b: userActions.loadUserSuccess({ user }) });

      expect(effects.loadUserRequested$).toBeObservable(expected);
      expect(userService.loadUser).toHaveBeenCalledTimes(1);
    });

    it('should dispatch Load User Failure action if loading user fails', () => {
      const error = { code: 500 };
      userService.loadUser.and.returnValue(cold('#', {}, error));

      actions$ = hot('--a-a', { a: userActions.loadUserRequested() });
      const expected = cold('--b-b', { b: userActions.loadUserFailure({ error: { errorObj: error } }) });

      expect(effects.loadUserRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.loadUser, 2);
    });
  });

  describe('Change Team Request', () => {
    it('should change team and dipatch Change Team Success action', () => {
      const request: ChangeTeamRequest = {
        teamId: '123',
        userId: user.id
      };
      userService.changeTeam.and.returnValue(cold('x', { x: request }));

      actions$ = hot('--a', { a: userActions.changeTeamRequested({ request }) });
      const expected = cold('--b', {
        b: userActions.changeTeamSuccess({ teamId: request.teamId })
      });

      expect(effects.changeTeamRequested$).toBeObservable(expected);
      expect(userService.changeTeam).toHaveBeenCalledTimes(1);
      expect(userService.changeTeam).toHaveBeenCalledWith(request);
      expect(guiFacade.showLoading).toHaveBeenCalledTimes(1);
    });

    it('should dispatch Change Team Failure action', () => {
      const request: ChangeTeamRequest = {
        teamId: '123',
        userId: user.id
      };
      const error = { code: 500 };
      userService.changeTeam.and.returnValue(cold('#', {}, error));

      actions$ = hot('--a--a', { a: userActions.changeTeamRequested({ request }) });
      const expected = cold('--b--b', { b: userActions.changeTeamFailure({ error: { errorObj: error } }) });

      expect(effects.changeTeamRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.changeTeam, 2, request);
      expect(guiFacade.showLoading).toHaveBeenCalledTimes(2);
      expect(guiFacade.hideLoading).not.toHaveBeenCalled();
    });
  });

  describe('Change Team Success', () => {
    it('should load team', () => {
      actions$ = cold('a-a', { a: userActions.changeTeamSuccess({ teamId: '123' }) });
      expect(effects.changeTeamSuccess$).toBeObservable(
        cold('a-a', { a: userActions.changeTeamSuccess({ teamId: '123' }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamFacade.loadTeam, 2, '123');
    });
  });

  describe('Update Name Requested', () => {
    it('should call service and dispatch actions', () => {
      actions$ = hot('--a', { a: userActions.updateNameRequested({ id: '1', newName: 'exampleUser' }) });
      userService.updateName.and.returnValue(cold('a', { a: 'exampleUser' }));

      expect(effects.updateNameRequested$).toBeObservable(
        cold('--b', { b: userActions.updateNameSuccess({ newName: 'exampleUser' }) })
      );

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.updateName, 1, '1', 'exampleUser');
    });

    it('should dispatch Update Name Failure when service fails', () => {
      actions$ = hot('--a--a', { a: userActions.updateNameRequested({ id: '1', newName: 'exampleUser' }) });
      userService.updateName.and.returnValue(cold('#', null, { code: 500 }));

      const expectedError = ErrorBuilder.from().withErrorObject({ code: 500 }).build();

      expect(effects.updateNameRequested$).toBeObservable(
        cold('--a--a', { a: userActions.updateNameFailure({ error: expectedError }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.updateName, 2, '1', 'exampleUser');
    });
  });

  describe('Handle Invitation Requested', () => {
    beforeEach(() => {
      invitationsService.get.calls.reset();
    });

    it('should not invoke if user Invitation Id is not set', () => {
      const userWithoutInvitationId: User = { ...user, invitationId: null };
      actions$ = cold('aa-a', { a: userActions.handleInvitationRequested({ user: userWithoutInvitationId }) });

      expect(effects.handleInvitationRequested$).toBeObservable(cold('----'));
      expect(invitationsService.get).not.toHaveBeenCalled();
    });

    it('should map to Handle Invitation Accept', () => {
      const userWithInvitation: User = { ...user, invitationId: '123' };
      actions$ = cold('aa-a', { a: userActions.handleInvitationRequested({ user: userWithInvitation }) });
      invitationsService.get.and.returnValue(cold('a', { a: invitation }));

      expect(effects.handleInvitationRequested$).toBeObservable(
        cold('aa-a', { a: userActions.handleInvitationAccept({ user: userWithInvitation, invitation }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(invitationsService.get, 3, '123');
    });

    [InvitationStatus.Accepted, InvitationStatus.Failed, InvitationStatus.Outdated, InvitationStatus.Requested].forEach(
      (status) => {
        it(`should map to Handle Invitation Reject if status is ${status}`, () => {
          invitation.status = status;
          const userWithInvitation: User = { ...user, invitationId: '123' };
          actions$ = cold('aa-a', { a: userActions.handleInvitationRequested({ user: userWithInvitation }) });
          invitationsService.get.and.returnValue(cold('a', { a: invitation }));

          expect(effects.handleInvitationRequested$).toBeObservable(
            cold('aa-a', { a: userActions.handleInvitationReject() })
          );
          JasmineCustomMatchers.toHaveBeenCalledTimesWith(invitationsService.get, 3, '123');
        });
      }
    );

    it('should map to Handle Invitation Failure', () => {
      const userWithInvitation: User = { ...user, invitationId: '123' };
      actions$ = cold('aa-a', { a: userActions.handleInvitationRequested({ user: userWithInvitation }) });
      invitationsService.get.and.returnValue(cold('#-#', null, { testError: '500' }));
      const error = ErrorBuilder.from().withErrorObject({ testError: '500' }).build();
      const toastr = ToastrDataBuilder.from(resources.team.invitation.acceptingFailed, ToastrMode.ERROR).build();

      expect(effects.handleInvitationRequested$).toBeObservable(
        cold('aa-a', { a: userActions.handleInvitationFailure({ error, toastr }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(invitationsService.get, 3, '123');
    });
  });

  describe('Handle Invitation Accept', () => {
    beforeEach(() => {
      userService.handleInvitation.calls.reset();
    });

    it('should handle invitation and map to Handle Invitation Success', () => {
      actions$ = cold('aa-a', { a: userActions.handleInvitationAccept({ user, invitation }) });
      userService.handleInvitation.and.returnValue(of(null));

      expect(effects.handleInvitationAccept$).toBeObservable(
        cold('aa-a', {
          a: userActions.handleInvitationSuccess({ teamId: invitation.teamId, teamName: invitation.teamName })
        })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.handleInvitation, 3, user, invitation);
    });

    it('should handle invitation and map to Handle Invitation Failure', () => {
      actions$ = cold('aa-a', { a: userActions.handleInvitationAccept({ user, invitation }) });
      userService.handleInvitation.and.returnValue(cold('#-#', null, { testError: 500 }));
      const error = ErrorBuilder.from().withErrorObject({ testError: 500 }).build();
      const toastr = ToastrDataBuilder.from(resources.team.invitation.acceptingFailed, ToastrMode.ERROR).build();

      expect(effects.handleInvitationAccept$).toBeObservable(
        cold('aa-a', { a: userActions.handleInvitationFailure({ error, toastr }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.handleInvitation, 3, user, invitation);
    });
  });

  describe('Handle Invitation Success', () => {
    it('should show toastr and map to Team Added action', () => {
      resourceService.format.and.returnValue('test message');
      guiFacade.showToastr.calls.reset();
      const toastr = ToastrDataBuilder.from('test message', ToastrMode.SUCCESS).build();
      actions$ = cold('aa-a', { a: userActions.handleInvitationSuccess({ teamId: '2', teamName: 'team 2' }) });

      expect(effects.handleInvitationSuccess$).toBeObservable(
        cold('aa-a', { a: userActions.teamAdded({ team: { id: '2', name: 'team 2' } }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        resourceService.format,
        3,
        resources.team.invitation.accepted,
        'team 2'
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(guiFacade.showToastr, 3, toastr);
    });
  });

  describe('Handle Invitation Reject', () => {
    it('should show toastr and hide loading', () => {
      actions$ = cold('aa-a-', { a: userActions.handleInvitationReject() });

      expect(effects.handleInvitationReject$).toBeObservable(
        cold('aa-a-', { a: userActions.handleInvitationReject() })
      );
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(3);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        guiFacade.showToastr,
        3,
        ToastrDataBuilder.from(resources.team.invitation.rejected, ToastrMode.WARNING).build()
      );
    });
  });

  it('should create failure effects', () => {
    errorEffectService.createFrom.and.returnValue(of(null));
    errorEffectService.createFrom.calls.reset();

    const actions = new Actions(of(createAction('test action')));

    effects = new UserEffects(
      actions,
      userService,
      errorEffectService,
      guiFacade,
      invitationsService,
      resourceService,
      teamFacade
    );

    expect(errorEffectService.createFrom).toHaveBeenCalledTimes(4);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions, userActions.loadUserFailure);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions, userActions.changeTeamFailure);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions, userActions.updateNameFailure);
    expect(errorEffectService.createFrom).toHaveBeenCalledWith(actions, userActions.handleInvitationFailure);
  });
});
