import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Route } from 'src/app/core/router/model/route.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { Team } from 'src/app/core/team/model/team.model';
import { TeamUtilsService } from 'src/app/core/team/services/team-utils.service';
import { User } from 'src/app/core/user/model/user.model';
import { UserUtilservice } from 'src/app/core/user/services/user-utils.service';
import { SharedDialogsService } from 'src/app/shared/services/dialogs/shared-dialogs.service';
import { GuiFacade } from '../../../../core/gui/gui.facade';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {
  @Input() team: Team;
  @Input() user: User;
  @Input() currentRoute: string;

  private changeTeamSubscription: Subscription;

  public teamMembersText = '';
  public routes: Route[];
  public isExpanded = true;

  constructor(
    private routerFacade: RouterFacade,
    private teamUtilsService: TeamUtilsService,
    private userUtilsService: UserUtilservice,
    private sharedDialogsService: SharedDialogsService,
    private guiFacade: GuiFacade
  ) {}

  public ngOnInit() {
    this.routes = this.routerFacade.selectAdonaRoutes();
    this.setTeamMembersText();
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
    this.guiFacade.toggleSideNavbarIfMobile();
  }

  public shouldShowChangeTeamAction(): boolean {
    return this.userUtilsService.hasMultipleTeams(this.user);
  }

  public shouldShowQuickActions(): boolean {
    return this.shouldShowChangeTeamAction();
  }

  public openChangeTeamDialog() {
    this.changeTeamSubscription = this.sharedDialogsService.changeTeam(this.user).subscribe(() => {
      this.setTeamMembersText();
      this.guiFacade.toggleSideNavbarIfMobile();
    });
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
