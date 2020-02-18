import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/core/team/model/team.model';
import { TeamFacade } from 'src/app/core/team/team.facade';
import { User } from 'src/app/core/user/model/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { SharedDialogsService } from 'src/app/shared/services/dialogs/shared-dialogs.service';
import { Route } from '../../core/router/model/route.model';
import { RouterFacade } from '../../core/router/router.facade';
import { SideNavbarService } from './service/side-navbar.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit, OnDestroy {
  private teamSubscription: Subscription;
  private currentRouteSubscription: Subscription;
  private userSubscription: Subscription;
  private changeTeamSubscription: Subscription;
  private user: User;

  @ViewChild('sideNav', { static: true })
  public sideNav: MatSidenav;
  public team: Team;
  public routes: Route[];
  public currentRoute: string;
  public isExpanded = true;

  constructor(
    private sideNavbarService: SideNavbarService,
    private teamFacade: TeamFacade,
    private routerFacade: RouterFacade,
    private userFacade: UserFacade,
    private sharedDialogsService: SharedDialogsService
  ) {}

  public ngOnInit() {
    this.teamSubscription = this.teamFacade.selectSelectedTeam().subscribe((selectedTeam: Team) => {
      this.team = selectedTeam;
    });
    this.currentRouteSubscription = this.routerFacade.selectCurrentRute().subscribe(route => {
      this.currentRoute = route;
    });
    this.userSubscription = this.userFacade.selectUser().subscribe((user: User) => {
      this.user = user;
    });
    this.sideNavbarService.init(this.sideNav);
    this.routes = this.routerFacade.selectAdonaRoutes();
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

    if (this.changeTeamSubscription) {
      this.changeTeamSubscription.unsubscribe();
    }
  }

  public onToggleSideNav() {
    this.sideNavbarService.toggleSideNav(this.sideNav);
  }

  public onNavigationLinkClicked() {
    this.sideNavbarService.closeIfMobile(this.sideNav);
  }

  public openChangeTeamDialog() {
    this.changeTeamSubscription = this.sharedDialogsService
      .changeTeam(this.user)
      .subscribe(() => this.sideNavbarService.closeIfMobile(this.sideNav));
  }
}
