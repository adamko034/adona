import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { userActions } from '../store/actions/user.actions';
import { AuthState } from '../store/reducers/auth/auth.reducer';
import { userQueries } from '../store/selectors/user.selectors';
import { ChangeTeamRequest } from '../team/model/change-team-request.model';
import { UserFacade } from './user.facade';

describe('User Facade', () => {
  let store: MockStore<AuthState>;
  let facade: UserFacade;
  let dispatchSpy;

  const user = UserTestBuilder.withDefaultData().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.get<Store<AuthState>>(Store);
    facade = new UserFacade(store);
    dispatchSpy = spyOn(store, 'dispatch');
    dispatchSpy.calls.reset();
  });

  describe('Select User', () => {
    it('should return user', () => {
      store.overrideSelector(userQueries.selectUser, user);

      const result = facade.selectUser();

      expect(result).toBeObservable(cold('x', { x: user }));
    });
  });

  describe('Select User Id', () => {
    it('should return user id', () => {
      store.overrideSelector(userQueries.selectUserId, user.id);

      const result = facade.selectUserId();

      expect(result).toBeObservable(cold('x', { x: user.id }));
    });
  });

  describe('Load User', () => {
    it('should dispatch Load User Requested action', () => {
      facade.loadUser(user.id);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(userActions.loadUserRequested({ id: user.id }));
    });
  });

  describe('Change Team', () => {
    it('should dispatch Change Team Requested action', () => {
      const request: ChangeTeamRequest = {
        teamId: '123',
        updated: new Date(),
        user
      };

      facade.changeTeam(request);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(userActions.changeTeamRequested({ request }));
    });
  });
});
