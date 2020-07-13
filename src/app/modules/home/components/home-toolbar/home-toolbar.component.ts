import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NewTeamRequest } from 'src/app/core/team/model/requests/new-team/new-team-request.model';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserUtilservice } from 'src/app/core/user/services/user-utils.service';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { DialogService } from 'src/app/shared/services/dialogs/dialog.service';
import { SharedDialogsService } from 'src/app/shared/services/dialogs/shared-dialogs.service';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { NewTeamDialogComponent } from '../dialogs/new-team-dialog/new-team-dialog.component';

@Component({
  selector: 'app-home-toolbar',
  templateUrl: './home-toolbar.component.html',
  styleUrls: ['./home-toolbar.component.scss']
})
export class HomeToolbarComponent implements OnInit, OnDestroy {
  @Input() user: User;

  private destroyed$: Subject<void>;

  constructor(
    private dialogService: DialogService,
    private teamFacade: TeamsFacade,
    private userUtils: UserUtilservice,
    private sharedDialogService: SharedDialogsService,
    private unsubscriberService: UnsubscriberService
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit() {}

  public ngOnDestroy() {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public openNewTeamDialog() {
    this.dialogService
      .open(NewTeamDialogComponent, { data: { user: this.user } })
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result: DialogResult<NewTeamRequest>) => {
        if (result?.payload) {
          this.teamFacade.addTeam(result.payload);
        }
      });
  }

  public openChangeTeamDialog() {
    this.sharedDialogService.changeTeam(this.user).pipe(takeUntil(this.destroyed$)).subscribe();
  }

  public userHasMultipleTeams(): boolean {
    return this.userUtils.hasMultipleTeams(this.user);
  }
}
