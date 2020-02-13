import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/core/team/model/team.model';
import { TeamFacade } from 'src/app/core/team/team.facade';
import { UserFacade } from 'src/app/core/user/user.facade';
import { User } from '../../../../core/user/model/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private teamSubscription: Subscription;
  private userSubscription: Subscription;

  public user: User;
  public team: Team;

  constructor(private userFacade: UserFacade, private teamFacade: TeamFacade) {}

  public ngOnInit() {
    this.teamFacade.loadSelectedTeam();
    this.teamSubscription = this.teamFacade.selectSelectedTeam().subscribe((team: Team) => {
      this.team = team;
    });
    this.userSubscription = this.userFacade.selectUser().subscribe((user: User) => {
      this.user = user;
    });
  }

  public ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.teamSubscription) {
      this.teamSubscription.unsubscribe();
    }
  }
}
