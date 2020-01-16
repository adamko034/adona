import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { User } from '../../../../core/auth/model/user-model';
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

  constructor(private authFacade: AuthFacade, private dialogService: DialogService) {}

  public ngOnInit() {
    this.userSubscription = this.authFacade.getUser().subscribe((user: User) => {
      this.user = user;
    });

    if (!this.userHasTeams()) {
      this.dialogService.open(NewTeamDialogComponent);
    }
  }

  public ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  public userHasTeams(): boolean {
    return this.user && this.user.teams && this.user.teams.length > 0;
  }
}
