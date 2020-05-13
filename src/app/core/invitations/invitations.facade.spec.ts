import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { InvitationsFacade } from 'src/app/core/invitations/invitations.facade';
import { NewInvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { invitationActions } from 'src/app/core/invitations/store/actions/invitation.actions';
import { TeamsTestDataBuilder } from 'src/app/core/team/utils/test/teams-test-data.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Invitations Facade', () => {
  let facade: InvitationsFacade;
  let store: MockStore;

  const { teamUtilsService } = SpiesBuilder.init().withTeamUtilsService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
    facade = new InvitationsFacade(store, teamUtilsService);
  });

  describe('Send', () => {
    const user = UserTestBuilder.withDefaultData().build();
    const team = TeamsTestDataBuilder.withDefaultData().build()[0];

    const request = NewInvitationRequestBuilder.from(user, team).build();
    let dispatchSpy;

    beforeEach(() => {
      dispatchSpy = spyOn(store, 'dispatch');
      teamUtilsService.isAtLeastOneMemberWithEmail.calls.reset();
    });

    it('should dispatch Invitation Send Request action if is at least one member with email provided', () => {
      teamUtilsService.isAtLeastOneMemberWithEmail.and.returnValue(true);

      facade.send(request);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamUtilsService.isAtLeastOneMemberWithEmail, 1, request.team);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        dispatchSpy,
        1,
        invitationActions.invitationsSendRequest({ request })
      );
    });

    it('should not dispatch action when there are no member with email provied', () => {
      teamUtilsService.isAtLeastOneMemberWithEmail.and.returnValue(false);

      facade.send(request);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamUtilsService.isAtLeastOneMemberWithEmail, 1, request.team);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});
