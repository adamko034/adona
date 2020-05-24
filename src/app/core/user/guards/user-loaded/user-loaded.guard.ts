import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, mapTo, take } from 'rxjs/operators';
import { UserFacade } from 'src/app/core/user/user.facade';

@Injectable({ providedIn: 'root' })
export class UserLoadedGuard implements CanActivate {
  constructor(private userFacade: UserFacade) {}

  public canActivate(): Observable<boolean> {
    return this.isUserLoaded();
  }

  private isUserLoaded(): Observable<boolean> {
    return this.userFacade.selectUser().pipe(
      filter((user) => !!user),
      mapTo(true),
      take(1)
    );
  }
}
