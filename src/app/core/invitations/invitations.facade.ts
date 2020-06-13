import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { InvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';
import { invitationActions } from 'src/app/core/invitations/store/actions/invitation.actions';

@Injectable({ providedIn: 'root' })
export class InvitationsFacade {
  constructor(private store: Store) {}

  public send(request: InvitationRequest): void {
    this.store.dispatch(invitationActions.invitationsSendRequest({ request }));
  }
}
