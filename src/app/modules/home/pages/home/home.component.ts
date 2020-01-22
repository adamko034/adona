import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { NewTeamRequest } from '../../../../core/user/model/new-team-request.model';
import { User } from '../../../../core/user/model/user-model';
import { UserUtilservice } from '../../../../core/user/services/user-utils.service';
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

  constructor(
    private authFacade: AuthFacade,
    private dialogService: DialogService,
    private userUtilsService: UserUtilservice
  ) {}

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
      .open(NewTeamDialogComponent, { data: { user: this.user, team: {} } })
      .subscribe((result: DialogResult<NewTeamRequest>) => {
        if (result.payload) {
          console.log('will be dispatching action with request:', result.payload);
        }
      });
  }
}
