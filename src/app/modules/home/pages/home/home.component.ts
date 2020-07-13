import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Team } from 'src/app/core/team/model/team/team.model';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public user: User;
  public team: Team;

  constructor(
    private userFacade: UserFacade,
    private teamFacade: TeamsFacade,
    private unsubscriberService: UnsubscriberService
  ) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit() {
    this.teamFacade
      .selectSelectedTeam()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((team: Team) => {
        this.team = team;
      });
    this.userFacade
      .selectUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  public ngOnDestroy() {
    this.unsubscriberService.complete(this.destroyed$);
  }
}
