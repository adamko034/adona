import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Team } from 'src/app/core/team/model/team/team.model';
import { settingsActions } from 'src/app/modules/settings/store/actions';
import { SettingsState } from 'src/app/modules/settings/store/reducers';
import { settingsQueries } from 'src/app/modules/settings/store/selectors/settings.selector';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  constructor(private store: Store<SettingsState>) {}

  public loadTeams(): void {
    this.store.dispatch(settingsActions.teams.loadTeamsRequested());
  }

  public selectTeams(): Observable<Team[]> {
    return this.store.pipe(select(settingsQueries.teams.selectAll));
  }
}
