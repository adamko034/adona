import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { settingsActions } from 'src/app/modules/settings/store/actions';
import { SettingsState } from 'src/app/modules/settings/store/reducers';
import { settingsQueries } from 'src/app/modules/settings/store/selectors/settings.selector';
import { SettingsFacade } from 'src/app/modules/settings/store/settings.facade';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Settings Facade', () => {
  let facade: SettingsFacade;
  let store: MockStore<SettingsState>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideMockStore() });

    store = TestBed.inject(MockStore);
    facade = new SettingsFacade(store);
  });

  describe('Load Teams', () => {
    it('should dispatch Load Teams Requested', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      facade.loadTeams();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(dispatchSpy, 1, settingsActions.teams.loadTeamsRequested());
    });
  });

  describe('Select Teams', () => {
    it('should run selector', () => {
      store.overrideSelector(settingsQueries.teams.selectAll, []);
      expect(facade.selectTeams()).toBeObservable(cold('a', { a: [] }));
    });
  });
});
