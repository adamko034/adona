import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mapTo, tap } from 'rxjs/operators';
import { TeamFacade } from 'src/app/core/team/teams.facade';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';

@Injectable({ providedIn: 'root' })
export class HandleUserInvitationGuard implements CanActivate {
  constructor(private userFacade: UserFacade, private teamsFacade: TeamFacade) {}

  public canActivate(): Observable<boolean> {
    return combineLatest([this.waitForUser(), this.waitForTeam()]).pipe(
      tap(([user]) => {
        if (!!user.invitationId) {
          this.userFacade.handleInvitation(user);
        }
      }),
      mapTo(true)
    );
  }

  private waitForTeam(): Observable<void> {
    return this.teamsFacade.selectTeam().pipe(
      filter((team) => !!team),
      map(() => undefined)
    );
  }

  private waitForUser(): Observable<User> {
    return this.userFacade.selectUser().pipe(filter((user) => !!user));
  }
}
