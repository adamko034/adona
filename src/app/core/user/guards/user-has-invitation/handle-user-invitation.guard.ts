import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, mapTo, tap } from 'rxjs/operators';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable({ providedIn: 'root' })
export class HandleUserInvitationGuard implements CanActivate {
  constructor(private userFacade: UserFacade) {}

  public canActivate(): Observable<boolean> {
    Logger.logDev('handle user invitation guard');
    return this.waitForUser().pipe(
      tap((user) => {
        if (!!user.invitationId) {
          this.userFacade.handleInvitation(user);
        }
      }),
      mapTo(true)
    );
  }

  private waitForUser(): Observable<User> {
    return this.userFacade.selectUser().pipe(filter((user) => !!user));
  }
}
