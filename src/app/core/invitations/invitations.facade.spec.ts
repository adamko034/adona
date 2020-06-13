import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { InvitationsFacade } from 'src/app/core/invitations/invitations.facade';
import { InvitationRequestBuilder } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.builder';
import { invitationActions } from 'src/app/core/invitations/store/actions/invitation.actions';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Invitations Facade', () => {
  let facade: InvitationsFacade;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
    facade = new InvitationsFacade(store);
  });

  describe('Send', () => {
    const request = InvitationRequestBuilder.from('user@example.com', '123', 'team 123', ['user2@example.com']).build();
    let dispatchSpy;

    beforeEach(() => {
      dispatchSpy = spyOn(store, 'dispatch');
    });

    it('should dispatch Invitation Send Request action', () => {
      facade.send(request);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        dispatchSpy,
        1,
        invitationActions.invitationsSendRequest({ request })
      );
    });
  });
});
