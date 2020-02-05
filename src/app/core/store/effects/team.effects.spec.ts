import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { SpiesBuilder } from '../../../utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from '../../../utils/testUtils/builders/user-test-builder';
import { TeamMembersBuilder } from '../../team/model/builders/team-members.builder';
import { TeamBuilder } from '../../team/model/builders/team.builder';
import { NewTeamRequest } from '../../team/model/new-team-request.model';
import { TeamService } from '../../team/services/team.service';
import { TeamFacade } from '../../team/team.facade';
import { UserFacade } from '../../user/user.facade';
import { teamActions } from '../actions/team.actions';
import { userActions } from '../actions/user.actions';
import { TeamEffects } from './team.effects';

fdescribe('Team Effects', () => {
  let actions$: Actions;
  let effects: TeamEffects;
  let newTeamRequest: NewTeamRequest;

  const user = UserTestBuilder.withDefaultData().build();

  const { userFacade, teamService, teamFacade } = SpiesBuilder.init()
    .withUserFacade()
    .withTeamService()
    .withTeamFacade()
    .build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeamEffects,
        provideMockActions(() => actions$),
        { provide: UserFacade, useValue: userFacade },
        { provide: TeamFacade, useValue: teamFacade },
        { provide: TeamService, useValue: teamService }
      ]
    });

    effects = TestBed.get<TeamEffects>(TeamEffects);

    userFacade.selectUserId.calls.reset();
    teamService.addTeam.calls.reset();
  });

  describe('New Team Requested', () => {
    beforeEach(() => {
      newTeamRequest = {
        created: new Date(),
        createdBy: 'test user',
        members: TeamMembersBuilder.from()
          .withMember('test user')
          .withMember('test user 2')
          .build(),
        name: 'new team name'
      };

      userFacade.selectUserId.and.returnValue(of(user.id));

      actions$ = hot('--a', { a: teamActions.newTeamRequested({ request: newTeamRequest }) });
    });

    it('should add team and dispatch actions: New Team Created, Team Added, Changed Team Success', () => {
      const team = TeamBuilder.from(
        '123',
        newTeamRequest.created,
        newTeamRequest.createdBy,
        newTeamRequest.name
      ).build();

      teamService.addTeam.and.returnValue(cold('x', { x: team }));

      const expected = cold('--(bcd)', {
        b: teamActions.newTeamCreateSuccess({ team }),
        c: userActions.teamAdded({ id: team.id, name: team.name, updated: team.created }),
        d: userActions.changeTeamSuccess({ teamId: team.id, updated: team.created })
      });

      expect(effects.newTeamRequested$).toBeObservable(expected);
      expect(userFacade.selectUserId).toHaveBeenCalledTimes(1);
      expect(teamService.addTeam).toHaveBeenCalledTimes(1);
      expect(teamService.addTeam).toHaveBeenCalledWith(newTeamRequest, user.id);
    });

    it('should dispatch New Team Create Failure action when adding team fails', () => {
      teamService.addTeam.and.returnValue(cold('#', {}, { code: 500 }));

      const expected = cold('--(b|)', { b: teamActions.newTeamCreateFailure({ error: { errorObj: { code: 500 } } }) });

      expect(effects.newTeamRequested$).toBeObservable(expected);
      expect(teamService.addTeam).toHaveBeenCalledTimes(1);
    });
  });
});
