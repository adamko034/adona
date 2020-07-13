import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
import { UserFacade } from 'src/app/core/user/user.facade';

@Component({
  selector: 'app-settings-team-members',
  templateUrl: './settings-team-members.component.html',
  styleUrls: ['./settings-team-members.component.scss']
})
export class SettingsTeamMembersComponent implements OnInit {
  @Input() members: TeamMember[];

  public editMode = false;
  public userId$: Observable<string>;

  constructor(private userFacade: UserFacade) {}

  public ngOnInit(): void {
    this.userId$ = this.userFacade.selectUserId();
  }

  public onToggleMode(mode: 'display' | 'edit'): void {
    this.editMode = mode === 'edit';
  }
}
