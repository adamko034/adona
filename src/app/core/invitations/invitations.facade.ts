import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NewInvitationRequest } from 'src/app/core/invitations/models/new-invitation-request/new-invitation-request.model';
import { invitationActions } from 'src/app/core/invitations/store/actions/invitation.actions';
import { TeamUtilsService } from 'src/app/core/team/services/team-utils.service';

@Injectable({ providedIn: 'root' })
export class InvitationsFacade {
  constructor(private store: Store, private teamUtilsService: TeamUtilsService) {}

  public send(request: NewInvitationRequest): void {
    if (this.teamUtilsService.isAtLeastOneMemberWithEmail(request.team)) {
      this.store.dispatch(invitationActions.invitationsSendRequest({ request }));
    }
  }
}
