import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { User } from '../../user/model/user.model';
import { UserService } from '../../user/services/user.service';
import { userActions } from '../actions/user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  @Effect()
  findUser$: Observable<Action> = this.actions$.pipe(
    ofType(userActions.findUser),
    switchMap(action => this.userService.getUser(action.id).pipe(take(1))),
    map((user: User) => userActions.userFound({ user }))
  );
}
