import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { teamsActions } from 'src/app/core/team/store/actions';
import { TeamEffects } from 'src/app/core/team/store/effects/team/team.effects';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/jasmine/teams-test-data.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Team Effects', () => {
  let effects: TeamEffects;
  let actions$: Actions;

  const {
    teamService,
    errorEffectService,
    guiFacade
  } = SpiesBuilder.init().withGuiFacade().withTeamService().withErrorEffectService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new TeamEffects(actions$, teamService, errorEffectService, guiFacade);
  });

  describe('Load Team Requested', () => {
    beforeEach(() => {
      teamService.loadTeam.calls.reset();
    });

    it('should call service and map to Load Selected Team Success action', () => {
      const team = TeamsTestDataBuilder.withDefaultData().buildOne();
      teamService.loadTeam.and.returnValue(cold('a', { a: team }));
      actions$ = cold('--a-a', { a: teamsActions.team.loadTeamRequested({ id: team.id }) });
      const expected = cold('--a-a', { a: teamsActions.team.loadTeamSuccess({ team }) });

      expect(effects.loadTeamRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.loadTeam, 2, team.id);
    });

    it('should map to Load Selected Team Failure action when service fails', () => {
      teamService.loadTeam.and.returnValue(cold('#', null, { testCode: '500' }));
      const error = ErrorBuilder.from().withErrorObject({ testCode: '500' }).build();
      actions$ = cold('--a-a', { a: teamsActions.team.loadTeamRequested({ id: '123' }) });

      const expected = cold('--a-a', { a: teamsActions.team.loadTeamFailure({ error }) });

      expect(effects.loadTeamRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.loadTeam, 2, '123');
    });
  });

  describe('Load Team Success', () => {
    it('should hide loading', () => {
      actions$ = cold('aa-a', { a: teamsActions.team.loadTeamSuccess({ team: {} as any }) });
      expect(effects.loadTeamSuccess$).toBeObservable(
        cold('aa-a', { a: teamsActions.team.loadTeamSuccess({ team: {} as any }) })
      );
      expect(guiFacade.hideLoading).toHaveBeenCalledTimes(3);
    });
  });

  it('should create failures effects', () => {
    errorEffectService.createFrom.calls.reset();
    effects = new TeamEffects(actions$, teamService, errorEffectService, guiFacade);
    JasmineCustomMatchers.toHaveBeenCalledTimesWith(
      errorEffectService.createFrom,
      1,
      actions$,
      teamsActions.team.loadTeamFailure
    );
  });
});
