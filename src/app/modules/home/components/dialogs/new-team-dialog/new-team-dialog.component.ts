import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewTeamRequestBuilder } from 'src/app/core/team/model/new-team-request/new-team-request.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamMemberBuilder } from 'src/app/core/team/model/team-member/team-member.builder';
import { TeamMember } from 'src/app/core/team/model/team-member/team-member.model';
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
    newMember: new FormControl('', [CustomValidators.requiredValue])
  });

  @ViewChild('newMemberInput')
  public newMemberInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<NewTeamDialogComponent>,
    private stepsService: NewTeamDialogStepsHelper
  ) {}

  public ngOnInit(): void {
    this.currentStep = this.steps.Name;
    this.members[this.data.user.name] = TeamMemberBuilder.fromUser(this.data.user).build();
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

  public addMember(type: string): void {
    const newMemberFormControl = this.form.get('newMember');

    if (type === 'friend') {
      newMemberFormControl.setErrors(Validators.email(newMemberFormControl));
    }

    if (newMemberFormControl.valid) {
      const name = newMemberFormControl.value.trim();
      this.members[name] = TeamMemberBuilder.from(name).withEmailAddress(name).build();
      this.form.get('newMember').reset();
    }
  }

  public changeNewMemberType() {
    this.form.get('newMember').reset();
    this.newMemberInput.nativeElement.focus();
  }

  public removeMember(member: TeamMember): void {
    if (member.name.toLocaleLowerCase().trim() !== this.data.user.name.toLocaleLowerCase()) {
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
    return Object.values(this.members).filter((member: TeamMember) => !!member.email).length > 1;
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
}
