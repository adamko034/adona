import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mapTo, take } from 'rxjs/operators';
import { User } from 'src/app/core/user/model/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';

@Injectable({ providedIn: 'root' })
export class HandleUserInvitationGuard implements CanActivate {
  constructor(private userFacade: UserFacade) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userFacade.selectUser().pipe(
      filter((user) => !!user),
      map((user: User) => {
        if (user.invitationId) {
          this.userFacade.handleInvitation(user.invitationId);
        }
      }),
      take(1),
      mapTo(true)
    );
  }
}
