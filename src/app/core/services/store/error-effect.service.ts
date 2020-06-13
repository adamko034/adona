import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrData } from 'src/app/core/gui/model/toastr/toastr-data/toastr-data.model';
import { errorActions } from 'src/app/core/store/actions/error.actions';
import { resources } from 'src/app/shared/resources/resources';
import { Error } from '../../error/model/error.model';

@Injectable({ providedIn: 'root' })
export class ErrorEffectService {
  public createFrom(
    actions$: Actions,
    failureAction: ActionCreator<
      string,
      (props: { error: Error; toastr?: ToastrData }) => { error: Error; toastr?: ToastrData } & TypedAction<string>
    >
  ): Observable<{ error: Error }> {
    return createEffect(() => {
      return actions$.pipe(
        ofType(failureAction),
        map((action) => {
          const error: Error = {
            ...action.error,
            message: action.error.message ? action.error.message : resources.general.errors.message
          };

          return errorActions.handleError({ error, toastr: action.toastr });
        })
      );
    });
  }
}
