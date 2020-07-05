import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { TeamMemberBuilder } from 'src/app/core/team/model/team-member/team-member.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { settingsActions } from 'src/app/modules/settings/store/actions';
import { SettingsTeamsEffects } from 'src/app/modules/settings/store/effects/teams/settings-teams.effects';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Settings Teams Effects', () => {
  let effects: SettingsTeamsEffects;
  let actions$: Actions;

  const {
    teamsFirebaseService,
    errorEffectService,
    apiRequestsFacade
  } = SpiesBuilder.init().withErrorEffectService().withApiRequestsFacade().withTeamsFirebaseService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockActions(() => actions$)] });

    actions$ = TestBed.inject<Actions>(Actions);
    effects = new SettingsTeamsEffects(actions$, teamsFirebaseService, errorEffectService, apiRequestsFacade);

    teamsFirebaseService.getAll.calls.reset();
    apiRequestsFacade.startRequest.calls.reset();
    apiRequestsFacade.successRequest.calls.reset();
  });

  describe('Load Teams Requested', () => {
    const members = [TeamMemberBuilder.from('user 1', 'url').build(), TeamMemberBuilder.from('user 2', 'url2').build()];
    const teams = [
      TeamBuilder.from('1', new Date(), 'user 1', 'team 1', members).build(),
      TeamBuilder.from('2', new Date(), 'user 1', 'team 2', members).build()
    ];
    beforeEach(() => {
      teamsFirebaseService.getAll.and.returnValue(cold('a', { a: teams }));
    });

    it('should load all teams and map to Load Teams Success', () => {
      actions$ = cold('--a-a', { a: settingsActions.teams.loadTeamsRequested() });

      expect(effects.loadTeamsRequested$).toBeObservable(
        cold('--a-a', { a: settingsActions.teams.loadTeamsSuccess({ teams }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        apiRequestsFacade.startRequest,
        2,
        apiRequestIds.settingsLoadTeams
      );
    });

    it('should map to Load Teams Failure if service fails', () => {
      teamsFirebaseService.getAll.and.returnValue(cold('#', null, { test: '500' }));
      actions$ = cold('--a-a', { a: settingsActions.teams.loadTeamsRequested() });
      const error = ErrorBuilder.from()
        .withErrorObject({ test: '500' })
        .withFirebaseError(apiRequestIds.settingsLoadTeams, '')
        .build();

      expect(effects.loadTeamsRequested$).toBeObservable(
        cold('--a-a', { a: settingsActions.teams.loadTeamsFailure({ error }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        apiRequestsFacade.startRequest,
        2,
        apiRequestIds.settingsLoadTeams
      );
    });
  });

  describe('Load Teams Success', () => {
    it('should success api request', () => {
      actions$ = cold('aaa', { a: settingsActions.teams.loadTeamsSuccess({ teams: [] }) });
      expect(effects.loadTeamsSuccess$).toBeObservable(
        cold('aaa', { a: settingsActions.teams.loadTeamsSuccess({ teams: [] }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        apiRequestsFacade.successRequest,
        3,
        apiRequestIds.settingsLoadTeams
      );
    });
  });

  it('should create failure effects', () => {
    errorEffectService.createFrom.calls.reset();

    effects = new SettingsTeamsEffects(actions$, teamsFirebaseService, errorEffectService, apiRequestsFacade);
    JasmineCustomMatchers.toHaveBeenCalledTimesWith(
      errorEffectService.createFrom,
      1,
      actions$,
      settingsActions.teams.loadTeamsFailure
    );
  });
});
