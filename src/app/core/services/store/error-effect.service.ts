import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DefaultErrorMessageBuilder } from '../../error/builders/default-error-message.builder';
import { DefaultErrorType } from '../../error/enum/default-error-type.enum';
import { Error } from '../../error/model/error.model';
import { ErrorOccuredAction } from '../../store/actions/error.actions';

@Injectable({ providedIn: 'root' })
export class ErrorEffectService {
  public createFrom(
    actions$: Actions,
    failureAction: ActionCreator<string, (props: { error: Error }) => { error: Error } & TypedAction<string>>,
    type: DefaultErrorType
  ): Observable<ErrorOccuredAction> {
    return createEffect(() => {
      return actions$.pipe(
        ofType(failureAction),
        map(action => {
          const error: Error = {
            ...action.error,
            message: action.error.message ? action.error.message : DefaultErrorMessageBuilder.from(type).build()
          };

          return new ErrorOccuredAction({ error });
        })
      );
    });
  }
}
