import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/core/team/model/team.model';
import { TeamFacade } from 'src/app/core/team/team.facade';
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

  @ViewChild('sideNav', { static: true })
  public sideNav: MatSidenav;
  public team: Team;
  public routes: Route[];
  public currentRoute: string;
  public isExpanded = true;

  constructor(
    private sideNavbarService: SideNavbarService,
    private teamFacade: TeamFacade,
    private routerFacade: RouterFacade
  ) {}

  public ngOnInit() {
    this.teamSubscription = this.teamFacade.selectSelectedTeam().subscribe((selectedTeam: Team) => {
      this.team = selectedTeam;
    });
    this.currentRouteSubscription = this.routerFacade.selectCurrentRute().subscribe(route => {
      this.currentRoute = route;
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
  }

  public onToggleSideNav() {
    this.sideNavbarService.toggleSideNav(this.sideNav);
  }

  public onNavigationLinkClicked() {
    this.sideNavbarService.closeIfMobile(this.sideNav);
  }
}
