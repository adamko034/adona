import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChangeTeamRequest } from 'src/app/core/team/model/change-team-request.model';
import { TeamFacade } from 'src/app/core/team/team.facade';
import { User } from 'src/app/core/user/model/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { ChangeTeamDialogComponent } from '../../components/dialogs/change-team-dialog/change-team-dialog.component';
import { DialogResult } from './dialog-result.model';
import { DialogService } from './dialog.service';

@Injectable({ providedIn: 'root' })
export class SharedDialogsService {
  constructor(private dialogService: DialogService, private userFacade: UserFacade, private teamFacade: TeamFacade) {}

  public changeTeam(user: User): Observable<DialogResult<string>> {
    return this.dialogService.open(ChangeTeamDialogComponent, { data: { user } }).pipe(
      tap((result: DialogResult<string>) => {
        if (result && result.payload) {
          const request: ChangeTeamRequest = {
            teamId: result.payload,
            user,
            updated: new Date()
          };

          this.userFacade.changeTeam(request);
          this.teamFacade.loadTeam(request.teamId);
        }
      })
    );
  }
}
