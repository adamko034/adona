import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { teamsActions } from 'src/app/core/team/store/actions';
import { SelectedTeamEffects } from 'src/app/core/team/store/effects/selected-team/selected-team.effects';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/jasmine/teams-test-data.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Selected Team Effects', () => {
  let effects: SelectedTeamEffects;
  let actions$: Actions;

  const { teamService, errorEffectService } = SpiesBuilder.init().withTeamService().withErrorEffectService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new SelectedTeamEffects(actions$, teamService, errorEffectService);
  });

  describe('Load Selected Team Requested', () => {
    beforeEach(() => {
      teamService.loadTeam.calls.reset();
    });

    it('should call service and map to Load Selected Team Success action', () => {
      const team = TeamsTestDataBuilder.withDefaultData().buildOne();
      teamService.loadTeam.and.returnValue(cold('a', { a: team }));
      actions$ = cold('--a-a', { a: teamsActions.selectedTeam.loadSelectedTeamRequested({ id: team.id }) });
      const expected = cold('--a-a', { a: teamsActions.selectedTeam.loadSelectedTeamSuccess({ team }) });

      expect(effects.loadSelectedTeamRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.loadTeam, 2, team.id);
    });

    it('should map to Load Selected Team Failure action when service fails', () => {
      teamService.loadTeam.and.returnValue(cold('#', null, { testCode: '500' }));
      const error = ErrorBuilder.from().withErrorObject({ testCode: '500' }).build();
      actions$ = cold('--a-a', { a: teamsActions.selectedTeam.loadSelectedTeamRequested({ id: '123' }) });

      const expected = cold('--a-a', { a: teamsActions.selectedTeam.loadSelectedTeamFailure({ error }) });

      expect(effects.loadSelectedTeamRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.loadTeam, 2, '123');
    });
  });

  it('should create failures effects', () => {
    errorEffectService.createFrom.calls.reset();
    effects = new SelectedTeamEffects(actions$, teamService, errorEffectService);
    JasmineCustomMatchers.toHaveBeenCalledTimesWith(
      errorEffectService.createFrom,
      1,
      actions$,
      teamsActions.selectedTeam.loadSelectedTeamFailure
    );
  });
});
