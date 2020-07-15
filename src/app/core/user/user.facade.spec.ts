import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { userActions, userActionTypes } from 'src/app/core/store/actions/user.actions';
import { AuthState } from 'src/app/core/store/reducers/auth/auth.reducer';
import { userQueries } from 'src/app/core/store/selectors/user.selectors';
import { ChangeTeamRequest } from 'src/app/core/team/model/requests/change-team/change-team-request.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('User Facade', () => {
  let store: MockStore<AuthState>;
  let facade: UserFacade;
  let dispatchSpy;

  const user = UserTestBuilder.withDefaultData().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
    facade = new UserFacade(store);
    dispatchSpy = spyOn(store, 'dispatch');
    dispatchSpy.calls.reset();
  });

  describe('Select User', () => {
    it('should return user', () => {
      store.overrideSelector(userQueries.user, user);

      const result = facade.selectUser();

      expect(result).toBeObservable(cold('x', { x: user }));
    });
  });

  describe('Select User Id', () => {
    it('should return user id', () => {
      store.overrideSelector(userQueries.userId, user.id);

      const result = facade.selectUserId();

      expect(result).toBeObservable(cold('x', { x: user.id }));
    });
  });

  describe('Load User', () => {
    it('should dispatch Load User Requested action', () => {
      facade.loadUser();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(userActions.loadUserRequested());
    });
  });

  describe('Change Team', () => {
    it('should dispatch Change Team Requested action', () => {
      const request: ChangeTeamRequest = {
        teamId: '123',
        userId: user.id
      };

      facade.changeTeam(request);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(userActions.changeTeamRequested({ request }));
    });
  });

  describe('Update Name', () => {
    it('should dispatch Update Name Requested action', () => {
      facade.updateName('1', 'example');

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, 1, {
        id: '1',
        newName: 'example',
        type: userActionTypes.updateNameRequested
      });
    });
  });

  describe('Update Team Name', () => {
    it('should dispatch Team Name Changed action', () => {
      const request = { id: '1', name: 'team 1' };
      facade.updateTeamName(request);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, 1, userActions.teamNameChanged({ request }));
    });
  });

  describe('Handle Invitation', () => {
    it('should dispatch Handle Invitation Requested action', () => {
      user.invitationId = '123';
      facade.handleInvitation(user);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, 1, userActions.handleInvitationRequested({ user }));
    });
  });

  describe('Select User Teams', () => {
    it('should return selector data', () => {
      const teams = [
        { id: '1', name: '1' },
        { id: '2', name: '2' }
      ];
      store.overrideSelector(userQueries.userTeams, teams);

      expect(facade.selectUserTeams()).toBeObservable(cold('b', { b: teams }));
    });
  });
});
