import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request.model';
import { TeamFacade } from 'src/app/core/team/team.facade';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { User } from '../../../../core/user/model/user-model';
import { DialogResult } from '../../../../shared/services/dialogs/dialog-result.model';
import { DialogService } from '../../../../shared/services/dialogs/dialog.service';
import { NewTeamDialogComponent } from '../../components/dialogs/new-team-dialog/new-team-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  private newTeamDialogSubscription: Subscription;

  public user: User;

  constructor(private authFacade: AuthFacade, private dialogService: DialogService, private teamFacade: TeamFacade) {}

  public ngOnInit() {
    this.userSubscription = this.authFacade.getUser().subscribe((user: User) => {
      this.user = user;
    });
  }

  public ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.newTeamDialogSubscription) {
      this.newTeamDialogSubscription.unsubscribe();
    }
  }

  public openNewTeamDialog() {
    this.newTeamDialogSubscription = this.dialogService
      .open(NewTeamDialogComponent, { data: { user: this.user } })
      .subscribe((result: DialogResult<NewTeamRequest>) => {
        if (result.payload) {
          this.teamFacade.addTeam(result.payload);
        }
      });
  }
}
