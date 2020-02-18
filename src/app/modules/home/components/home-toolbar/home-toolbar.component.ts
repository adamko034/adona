import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request.model';
import { TeamFacade } from 'src/app/core/team/team.facade';
import { User } from 'src/app/core/user/model/user.model';
import { UserUtilservice } from 'src/app/core/user/services/user-utils.service';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { DialogService } from 'src/app/shared/services/dialogs/dialog.service';
import { SharedDialogsService } from 'src/app/shared/services/dialogs/shared-dialogs.service';
import { NewTeamDialogComponent } from '../dialogs/new-team-dialog/new-team-dialog.component';

@Component({
  selector: 'app-home-toolbar',
  templateUrl: './home-toolbar.component.html',
  styleUrls: ['./home-toolbar.component.scss']
})
export class HomeToolbarComponent implements OnInit {
  @Input() user: User;

  private newTeamDialogSubscription: Subscription;
  private changeTeamDialogSubscription: Subscription;

  constructor(
    private dialogService: DialogService,
    private teamFacade: TeamFacade,
    private userUtils: UserUtilservice,
    private sharedDialoService: SharedDialogsService
  ) {}

  public ngOnInit() {}

  public ngOnDestroy() {
    if (this.newTeamDialogSubscription) {
      this.newTeamDialogSubscription.unsubscribe();
    }

    if (this.changeTeamDialogSubscription) {
      this.changeTeamDialogSubscription.unsubscribe();
    }
  }

  public openNewTeamDialog() {
    this.newTeamDialogSubscription = this.dialogService
      .open(NewTeamDialogComponent, { data: { user: this.user } })
      .subscribe((result: DialogResult<NewTeamRequest>) => {
        if (result && result.payload) {
          this.teamFacade.addTeam(result.payload);
        }
      });
  }

  public openChangeTeamDialog() {
    this.changeTeamDialogSubscription = this.sharedDialoService.changeTeam(this.user).subscribe();
  }

  public userHasMultipleTeams() {
    return this.userUtils.hasMultipleTeams(this.user);
  }
}
