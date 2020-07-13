import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Team } from 'src/app/core/team/model/team/team.model';
import { DateFormat } from 'src/app/shared/services/time/model/date-format.enum';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-settings-team-name',
  templateUrl: './settings-team-name.component.html',
  styleUrls: ['./settings-team-name.component.scss']
})
export class SettingsTeamNameComponent implements OnInit {
  @Input() team: Team;

  public teamNameFormControl = new FormControl('', [CustomValidators.requiredValue]);
  public editMode = false;
  public dateFormat = DateFormat.DayMonthYear;

  constructor() {}

  public ngOnInit(): void {
    this.teamNameFormControl.setValue(this.team.name);
  }

  public onToggleMode(mode: 'display' | 'edit'): void {
    this.editMode = mode === 'edit';
  }
}
