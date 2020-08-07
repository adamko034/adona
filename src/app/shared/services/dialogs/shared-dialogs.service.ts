import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { ChangeTeamDialogComponent } from 'src/app/shared/components/dialogs/change-team-dialog/change-team-dialog.component';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { DialogService } from 'src/app/shared/services/dialogs/dialog.service';

@Injectable({ providedIn: 'root' })
export class SharedDialogsService {
  constructor(private dialogService: DialogService, private userFacade: UserFacade, private teamFacade: TeamsFacade) {}

  public changeTeam(user: User): Observable<DialogResult<string>> {
    return this.dialogService.open(ChangeTeamDialogComponent, { data: { user } }).pipe(
      tap((result: DialogResult<string>) => {
        if (result && result.payload) {
          this.userFacade.changeTeam(result.payload);
        }
      })
    );
  }
}
