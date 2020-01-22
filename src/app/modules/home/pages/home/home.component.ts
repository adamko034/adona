import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { User } from '../../../../core/user/model/user-model';
import { UserUtilservice } from '../../../../core/user/services/user-utils.service';
import { DialogService } from '../../../../shared/services/dialogs/dialog.service';
import { NewTeamDialogComponent } from '../../components/dialogs/new-team-dialog/new-team-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;

  public user: User;

  constructor(
    private authFacade: AuthFacade,
    private dialogService: DialogService,
    private userUtilsService: UserUtilservice
  ) {}

  public ngOnInit() {
    this.userSubscription = this.authFacade.getUser().subscribe((user: User) => {
      this.user = user;

      if (this.user) {
        this.openNewTeamDialog();
      }
    });
  }

  public ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  public openNewTeamDialog() {
    if (!this.userUtilsService.hasTeams(this.user)) {
      this.dialogService.open(NewTeamDialogComponent, { data: { user: this.user, team: {} } });
    }
  }
}
