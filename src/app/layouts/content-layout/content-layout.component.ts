import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/core/team/model/team.model';
import { TeamFacade } from 'src/app/core/team/team.facade';
import { User } from 'src/app/core/user/model/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { GuiFacade } from '../../core/gui/gui.facade';
import { SideNavbarOptions } from '../../core/gui/model/side-navbar-options.model';
import { RouterFacade } from '../../core/router/router.facade';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit, OnDestroy {
  private teamSubscription: Subscription;
  private currentRouteSubscription: Subscription;
  private userSubscription: Subscription;
  private sideNavbarOptionsSubscription: Subscription;

  @ViewChild('sideNav', { static: true })
  public sideNav: MatSidenav;

  public user: User;
  public team: Team;
  public currentRoute: string;

  constructor(
    private teamFacade: TeamFacade,
    private routerFacade: RouterFacade,
    private userFacade: UserFacade,
    private guiFacade: GuiFacade
  ) {}

  public ngOnInit() {
    this.guiFacade.initSideNavbar();
    this.teamFacade.loadSelectedTeam();

    this.teamSubscription = this.teamFacade.selectSelectedTeam().subscribe((selectedTeam: Team) => {
      this.team = selectedTeam;
    });
    this.currentRouteSubscription = this.routerFacade.selectCurrentRute().subscribe(route => {
      this.currentRoute = route;
    });
    this.userSubscription = this.userFacade.selectUser().subscribe((user: User) => {
      this.user = user;
    });
    this.sideNavbarOptionsSubscription = this.guiFacade
      .selectSideNavbarOptions()
      .subscribe((options: SideNavbarOptions) => {
        if (options) {
          this.sideNav.mode = options.mode;
          options.opened ? this.sideNav.open() : this.sideNav.close();
        }
      });
  }

  public ngOnDestroy() {
    if (this.teamSubscription) {
      this.teamSubscription.unsubscribe();
    }

    if (this.currentRouteSubscription) {
      this.currentRouteSubscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.sideNavbarOptionsSubscription) {
      this.sideNavbarOptionsSubscription.unsubscribe();
    }
  }
}
