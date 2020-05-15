import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { errors } from 'src/app/core/error/constants/errors.constants';
import { errorActions } from 'src/app/core/store/actions/error.actions';
import { Error } from '../../error/model/error.model';

@Injectable({ providedIn: 'root' })
export class ErrorEffectService {
  public createFrom(
    actions$: Actions,
    failureAction: ActionCreator<string, (props: { error: Error }) => { error: Error } & TypedAction<string>>
  ): Observable<{ error: Error }> {
    return createEffect(() => {
      return actions$.pipe(
        ofType(failureAction),
        map((action) => {
          const error: Error = {
            ...action.error,
            message: action.error.message ? action.error.message : errors.DEFAULT_MESSAGE
          };

          return errorActions.handleError({ error });
        })
      );
    });
  }
}
