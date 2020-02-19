import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';
import { Route } from 'src/app/core/router/model/route.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { Team } from 'src/app/core/team/model/team.model';
import { TeamUtilsService } from 'src/app/core/team/services/team-utils.service';
import { User } from 'src/app/core/user/model/user.model';
import { UserUtilservice } from 'src/app/core/user/services/user-utils.service';
import { SharedDialogsService } from 'src/app/shared/services/dialogs/shared-dialogs.service';
import { SideNavbarService } from '../../service/side-navbar.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnChanges, OnDestroy {
  @Input() team: Team;
  @Input() user: User;
  @Input() currentRoute: string;
  @Input() showSideNav: boolean;

  private changeTeamSubscription: Subscription;

  @ViewChild('sideNav', { static: true })
  public sideNav: MatSidenav;

  public isExpanded = true;
  public teamMembersText = '';
  public routes: Route[];

  constructor(
    private routerFacade: RouterFacade,
    private teamUtilsService: TeamUtilsService,
    private sideNavbarService: SideNavbarService,
    private userUtilsService: UserUtilservice,
    private sharedDialogsService: SharedDialogsService
  ) {}

  public ngOnInit() {
    this.routes = this.routerFacade.selectAdonaRoutes();

    this.sideNavbarService.init(this.sideNav);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!!changes.team.currentValue && changes.team.currentValue !== changes.team.previousValue) {
      console.log('ng on changes, has team');
      this.setTeamMembersText();
    }

    if (!!changes.showSideNav && changes.showSideNav.currentValue !== changes.showSideNav.previousValue) {
      this.sideNavbarService.toggleSideNav(this.sideNav);
    }
  }

  public ngOnDestroy() {
    if (this.changeTeamSubscription) {
      this.changeTeamSubscription.unsubscribe();
    }
  }

  public toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  public onNavigationLinkClicked() {
    this.sideNavbarService.closeIfMobile(this.sideNav);
  }

  public shouldShowChangeTeamAction(): boolean {
    return this.userUtilsService.hasMultipleTeams(this.user);
  }

  public shouldShowQuickActions(): boolean {
    return this.shouldShowChangeTeamAction();
  }

  public openChangeTeamDialog() {
    this.changeTeamSubscription = this.sharedDialogsService
      .changeTeam(this.user)
      .subscribe(() => this.sideNavbarService.closeIfMobile(this.sideNav));
  }

  private setTeamMembersText() {
    const membersCount = this.teamUtilsService.getMembersCount(this.team);
    const maxTextChars = 28;
    let text = '';

    if (this.team && this.team.members) {
      let namesUsedCount = 0;
      for (const key in this.team.members) {
        const name = this.team.members[key].name;
        text += name + ', ';
        namesUsedCount += 1;

        if (text.length >= maxTextChars) break;
      }

      text = text.slice(0, -2);

      if (namesUsedCount < membersCount) {
        text += ` and ${membersCount - namesUsedCount} more...`;
      }
    }

    this.teamMembersText = text;
  }
}
