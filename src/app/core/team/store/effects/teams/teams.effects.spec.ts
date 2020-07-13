import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { TeamMemberBuilder } from 'src/app/core/team/model/team-member/team-member.builder';
import { TeamBuilder } from 'src/app/core/team/model/team/team.builder';
import { teamsActions } from 'src/app/core/team/store/actions';
import { TeamsEffects } from 'src/app/core/team/store/effects/teams/teams.effects';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Teams Effects', () => {
  let actions$: Actions;
  let effects: TeamsEffects;

  const {
    teamService,
    errorEffectService,
    apiRequestsFacade
  } = SpiesBuilder.init().withApiRequestsFacade().withTeamService().withErrorEffectService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamsEffects, provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new TeamsEffects(actions$, apiRequestsFacade, teamService, errorEffectService);

    teamService.getAll.calls.reset();
    errorEffectService.createFrom.calls.reset();
    apiRequestsFacade.successRequest.calls.reset();
    apiRequestsFacade.startRequest.calls.reset();
  });

  describe('Load Teams Requested', () => {
    const members = [TeamMemberBuilder.from('user 1', 'url').build(), TeamMemberBuilder.from('user 2', 'url2').build()];
    const teams = [
      TeamBuilder.from('1', new Date(), 'user 1', 'team 1', members).build(),
      TeamBuilder.from('2', new Date(), 'user 1', 'team 2', members).build()
    ];
    beforeEach(() => {
      teamService.getAll.and.returnValue(cold('a', { a: teams }));
    });

    it('should load all teams and map to Load Teams Success', () => {
      actions$ = cold('--a-a', { a: teamsActions.teams.loadTeamsRequested() });

      expect(effects.loadTeamsRequested$).toBeObservable(
        cold('--a-a', { a: teamsActions.teams.loadTeamsSuccess({ teams }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.loadTeams);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.successRequest, 2, apiRequestIds.loadTeams);
    });

    it('should map to Load Teams Failure if service fails', () => {
      teamService.getAll.and.returnValue(cold('#', null, { test: '500' }));
      actions$ = cold('--a-a', { a: teamsActions.teams.loadTeamsRequested() });
      const error = ErrorBuilder.from()
        .withErrorObject({ test: '500' })
        .withFirebaseError(apiRequestIds.loadTeams, '')
        .build();

      expect(effects.loadTeamsRequested$).toBeObservable(
        cold('--a-a', { a: teamsActions.teams.loadTeamsFailure({ error }) })
      );
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.loadTeams);
    });
  });

  it('should create failure effects', () => {
    errorEffectService.createFrom.calls.reset();

    effects = new TeamsEffects(actions$, apiRequestsFacade, teamService, errorEffectService);
    JasmineCustomMatchers.toHaveBeenCalledTimesWith(
      errorEffectService.createFrom,
      1,
      actions$,
      teamsActions.teams.loadTeamsFailure
    );
  });
});
