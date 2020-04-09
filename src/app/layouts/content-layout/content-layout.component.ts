import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Team } from 'src/app/core/team/model/team.model';
import { TeamFacade } from 'src/app/core/team/team.facade';
import { User } from 'src/app/core/user/model/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { GuiFacade } from '../../core/gui/gui.facade';
import { SideNavbarOptions } from '../../core/gui/model/side-navbar-options.model';
import { RouterFacade } from '../../core/router/router.facade';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  @ViewChild('sideNav', { static: true })
  public sideNav: MatSidenav;

  public user: User;
  public team: Team;
  public currentRoute: string;

  constructor(
    private teamFacade: TeamFacade,
    private routerFacade: RouterFacade,
    private userFacade: UserFacade,
    private guiFacade: GuiFacade,
    private unsubscriberService: UnsubscriberService
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit() {
    this.guiFacade.initSideNavbar();
    this.teamFacade.loadSelectedTeam();

    this.teamFacade
      .selectSelectedTeam()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((selectedTeam: Team) => {
        this.team = selectedTeam;
      });
    this.routerFacade
      .selectCurrentRute()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((route) => {
        this.currentRoute = route;
      });
    this.userFacade
      .selectUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user: User) => {
        this.user = user;
      });
    this.guiFacade
      .selectSideNavbarOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((options: SideNavbarOptions) => {
        if (options) {
          this.sideNav.mode = options.mode;
          options.opened ? this.sideNav.open() : this.sideNav.close();
        }
      });
  }

  public ngOnDestroy() {
    this.unsubscriberService.complete(this.destroyed$);
  }
}
