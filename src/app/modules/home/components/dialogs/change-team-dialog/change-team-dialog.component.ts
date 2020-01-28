import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TeamInUser } from '../../../../../core/user/model/team-in-user.model';

@Component({
  selector: 'app-change-team-dialog',
  templateUrl: './change-team-dialog.component.html',
  styleUrls: ['./change-team-dialog.component.css']
})
export class ChangeTeamDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { teams: { [id: string]: TeamInUser } }) {}

  ngOnInit() {}
}
