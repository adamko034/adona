import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/core/team/model/team.model';
import { TeamFacade } from 'src/app/core/team/team.facade';
import { User } from 'src/app/core/user/model/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
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

  public user: User;
  public team: Team;
  public currentRoute: string;
  public showSideNav: boolean;

  constructor(private teamFacade: TeamFacade, private routerFacade: RouterFacade, private userFacade: UserFacade) {}

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
  }

  public onToggleSideNav() {
    this.showSideNav = !this.showSideNav;
  }
}
