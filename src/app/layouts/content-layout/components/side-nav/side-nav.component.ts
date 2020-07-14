import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Route } from 'src/app/core/router/model/route.model';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { Team } from 'src/app/core/team/model/team/team.model';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserUtilservice } from 'src/app/core/user/services/user-utils.service';
import { SharedDialogsService } from 'src/app/shared/services/dialogs/shared-dialogs.service';
import { GuiFacade } from '../../../../core/gui/gui.facade';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy, OnChanges {
  @Input() team: Team;
  @Input() user: User;
  @Input() currentRoute: string;

  private changeTeamSubscription: Subscription;

  public teamMembersText = '';
  public routes: Route[];
  public isExpanded = true;

  constructor(
    private routerFacade: RouterFacade,
    private userUtilsService: UserUtilservice,
    private sharedDialogsService: SharedDialogsService,
    private guiFacade: GuiFacade
  ) {}

  public ngOnInit() {
    this.routes = this.routerFacade.selectAdonaRoutes();
    this.setTeamMembersText();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.team && changes.team.currentValue !== changes.team.previousValue) {
      this.setTeamMembersText();
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
      this.guiFacade.toggleSideNavbarIfMobile();
    });
  }

  private setTeamMembersText() {
    if (this.team) {
      const membersCount = this.team.members.length;
      const maxTextChars = 28;
      let text = '';

      let namesUsedCount = 0;
      for (const member of this.team.members) {
        const name = member.name;
        text += name + ', ';
        namesUsedCount += 1;

        if (text.length >= maxTextChars) break;
      }

      text = text.slice(0, -2);

      if (namesUsedCount < membersCount) {
        text += ` and ${membersCount - namesUsedCount} more...`;
      }

      this.teamMembersText = text;
    }
  }
}
