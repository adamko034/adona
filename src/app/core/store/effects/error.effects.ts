import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { errorActions } from 'src/app/core/store/actions/error.actions';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';

@Injectable()
export class ErrorEffects {
  constructor(private actions$: Actions, private environmentService: EnvironmentService) {}

  public broadcast$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(errorActions.broadcast),
        tap((action) => {
          if (this.environmentService.isDev()) {
            console.error(action.error);
          }
        })
      );
    },
    { dispatch: false }
  );
}
