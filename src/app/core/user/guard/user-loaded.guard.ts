import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { UserFacade } from '../user.facade';

@Injectable({ providedIn: 'root' })
export class UserLoadedGuard implements CanActivate {
  constructor(private userFacade: UserFacade) {}

  public canActivate(): Observable<boolean> {
    return this.isUserLoaded();
  }

  private isUserLoaded(): Observable<boolean> {
    return this.userFacade.selectUser().pipe(
      map(user => !!user),
      filter(loaded => loaded),
      take(1)
    );
  }
}
