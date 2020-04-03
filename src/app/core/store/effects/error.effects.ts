import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { ErrorActions, ErrorActionTypes, ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Injectable()
export class ErrorEffects {
  constructor(
    private actions$: Actions,
    private environmentService: EnvironmentService,
    private guiFacade: GuiFacade
  ) {}

  @Effect()
  errorOccured$ = this.actions$.pipe(
    ofType<ErrorActions>(ErrorActionTypes.ErrorOccured),
    tap((action: ErrorOccuredAction) => {
      if (this.environmentService.isDev()) {
        console.error(action.payload.error);
      }
    }),
    map(() => this.guiFacade.apiRequestFailed())
  );
}
