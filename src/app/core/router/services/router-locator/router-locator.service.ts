import { Injectable } from '@angular/core';
import { routesN } from 'src/app/core/router/constants/routes.constants';
import { RouteWithParams } from 'src/app/core/router/model/route-with-params.model';

@Injectable({ providedIn: 'root' })
export class RouterLocatorService {
  constructor() {}

  public isTeamDetailsPage(teamId: string, routeWithParams: RouteWithParams): boolean {
    const isTeamDetailsPage = routeWithParams.route.includes(routesN.settings.teams.url);
    const isTeamIdSet = routeWithParams.params?.id === teamId;

    return isTeamDetailsPage && isTeamIdSet;
  }
}
