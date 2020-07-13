import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SideNavbarOptions } from 'src/app/core/gui/model/side-navbar-options/side-navbar-options.model';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { GuiFacade } from '../../core/gui/gui.facade';
import { RouterFacade } from '../../core/router/router.facade';

interface ContentLayoutComponentData {
  user: User;
  team: Team;
  showLoading: boolean;
  route: string;
  sideNavbarOptions: SideNavbarOptions;
}

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  @ViewChild('sideNav', { static: true })
  public sideNav: MatSidenav;

  public data$: Observable<ContentLayoutComponentData>;

  constructor(
    private teamFacade: TeamsFacade,
    private routerFacade: RouterFacade,
    private userFacade: UserFacade,
    private guiFacade: GuiFacade,
    private unsubscriberService: UnsubscriberService
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit() {
    this.data$ = combineLatest([
      this.guiFacade.selectLoading(),
      this.teamFacade.selectSelectedTeam(),
      this.routerFacade.selectCurrentRute(),
      this.userFacade.selectUser(),
      this.guiFacade.selectSideNavbarOptions()
    ]).pipe(
      map(([showLoading, team, route, user, sideNavbarOptions]) => ({
        showLoading,
        team,
        route,
        user,
        sideNavbarOptions
      })),
      takeUntil(this.destroyed$)
    );

    this.guiFacade.initSideNavbar();
  }

  public ngOnDestroy() {
    this.unsubscriberService.complete(this.destroyed$);
  }
}
