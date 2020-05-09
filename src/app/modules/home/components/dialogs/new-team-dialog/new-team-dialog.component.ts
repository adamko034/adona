import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewTeamRequestBuilder } from 'src/app/core/team/model/new-team-request/new-team-request.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamMemberBuilder } from 'src/app/core/team/model/team-member/team-member.builder';
import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
import { UserUtilservice } from 'src/app/core/user/services/user-utils.service';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';
import { User } from '../../../../../core/user/model/user.model';
import { DialogResult } from '../../../../../shared/services/dialogs/dialog-result.model';
import { NewTeamDialogStep } from './models/new-team-dialog-step.enum';
import { NewTeamDialogStepsHelper } from './service/new-team-dialog-steps-helper.service';

@Component({
  selector: 'app-new-team-dialog',
  templateUrl: './new-team-dialog.component.html',
  styleUrls: ['./new-team-dialog.component.scss']
})
export class NewTeamDialogComponent implements OnInit {
  public currentStep: NewTeamDialogStep;
  public members: { [name: string]: TeamMember } = {};

  public steps = NewTeamDialogStep;
  public form: FormGroup = new FormGroup({
    name: new FormControl('', [CustomValidators.requiredValue]),
    newFriend: new FormControl('', [Validators.email, CustomValidators.requiredValue]),
    newMember: new FormControl('', [CustomValidators.requiredValue])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<NewTeamDialogComponent>,
    private stepsService: NewTeamDialogStepsHelper,
    private userUtilsService: UserUtilservice
  ) {}

  public ngOnInit(): void {
    this.currentStep = this.steps.Name;
    this.members[this.data.user.name] = { name: this.data.user.name };
  }

  public getDialogTitle(): string {
    switch (this.currentStep) {
      case NewTeamDialogStep.Name:
        return 'New Team';
      case NewTeamDialogStep.Users:
        return 'Assign Members';
      case NewTeamDialogStep.Summary:
        return 'Summary';
    }
  }

  public nextStep(): void {
    if (this.isStepValid()) {
      this.currentStep = this.stepsService.getNextStep(this.currentStep);
    }
  }

  public previousStep(): void {
    this.currentStep = this.stepsService.getPreviousStep(this.currentStep);
  }

  public addMember(): void {
    const newMemberFormControl = this.form.get('newMember');

    if (newMemberFormControl.valid) {
      const name = this.form.get('newMember').value.trim();
      this.members[name] = TeamMemberBuilder.from(name).build();
      this.resetMembersFormControls();
    }
  }

  public addFriend(): void {
    const newFriendFormControl = this.form.get('newFriend');

    if (this.form.get('newFriend').valid) {
      const email = newFriendFormControl.value.trim();
      const name = this.userUtilsService.extractUsernameFromEmail(email);
      this.members[name] = TeamMemberBuilder.from(name).withEmailAddress(email).build();
      this.resetMembersFormControls();
    }
  }

  public removeMember(member: TeamMember): void {
    if (member.name.toLocaleLowerCase().trim() !== 'you') {
      delete this.members[member.name];
    }
  }

  public isCurrentUser(member: TeamMember): boolean {
    return member.name.toLocaleLowerCase().trim() === this.data.user.name.toLocaleLowerCase();
  }

  public formatMemberName(member: TeamMember): string {
    if (this.isCurrentUser(member)) {
      return `${member.name} (you)`;
    }

    return member.email ? member.email : member.name;
  }

  public shouldSendInvitations(): boolean {
    return Object.values(this.members).findIndex((member: TeamMember) => !!member.email) > 0;
  }

  public save(): void {
    const result: DialogResult<NewTeamRequest> = {
      payload: NewTeamRequestBuilder.from(this.form.get('name').value.trim(), this.data.user.name, this.members).build()
    };

    this.dialogRef.close(result);
  }

  public close(): void {
    this.dialogRef.close(null);
  }

  private isStepValid(): boolean {
    switch (this.currentStep) {
      case this.steps.Name:
        return this.form.get('name').valid;
      default:
        return true;
    }
  }

  private resetMembersFormControls(): void {
    this.form.get('newFriend').reset();
    this.form.get('newMember').reset();
  }
}
