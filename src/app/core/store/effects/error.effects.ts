import { Injectable } from '@angular/core';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  ErrorActions,
  ErrorActionTypes,
  ErrorOccuredAction
} from 'src/app/core/store/actions/error.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorEffects {
  constructor(private actions$: Actions, private environmentService: EnvironmentService) {}

  @Effect({ dispatch: false })
  errorOccured$ = this.actions$.pipe(
    ofType<ErrorActions>(ErrorActionTypes.ErrorOccured),
    tap((action: ErrorOccuredAction) => {
      if (this.environmentService.isDev()) {
        console.log(action.payload.error);
      }
    })
  );
}
