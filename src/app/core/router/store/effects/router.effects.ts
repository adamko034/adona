import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { RouterLocatorService } from 'src/app/core/router/services/router-locator/router-locator.service';
import { routerActions } from 'src/app/core/router/store/actions/router.actions';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { Logger } from 'src/app/shared/utils/logger/logger';

@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private routerFacade: RouterFacade,
    private routerLocator: RouterLocatorService,
    private navigationService: NavigationService
  ) {}

  public teamDeleted$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerActions.teamDeleted),
        concatMap((action) => of(action).pipe(withLatestFrom(this.routerFacade.selectCurrentRouteWithParams()))),
        tap(([action, routeWithParams]) => {
          Logger.logDev('router effect, on team deleted, ' + action.id + ' ' + JSON.stringify(routeWithParams));
          if (this.routerLocator.isTeamDetailsPage(action.id, routeWithParams)) {
            Logger.logDev('router effects, on team deleted, moving to teams list');
            this.navigationService.toSettingsTeamsList();
          }
        }),
        map(([action]) => action)
      );
    },
    { dispatch: false }
  );
}
