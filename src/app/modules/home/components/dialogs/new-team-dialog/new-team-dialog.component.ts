import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewTeamMemberBuilder } from 'src/app/core/team/model/requests/new-team/new-team-member.builder';
import { NewTeamMember } from 'src/app/core/team/model/requests/new-team/new-team-member.model';
import { NewTeamRequestBuilder } from 'src/app/core/team/model/requests/new-team/new-team-request.builder';
import { NewTeamRequest } from 'src/app/core/team/model/requests/new-team/new-team-request.model';
import { User } from 'src/app/core/user/model/user/user.model';
import { NewTeamDialogStep } from 'src/app/modules/home/components/dialogs/new-team-dialog/models/new-team-dialog-step.enum';
import { NewTeamDialogStepsHelper } from 'src/app/modules/home/components/dialogs/new-team-dialog/service/new-team-dialog-steps-helper.service';
import { DialogResult } from 'src/app/shared/services/dialogs/dialog-result.model';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-new-team-dialog',
  templateUrl: './new-team-dialog.component.html',
  styleUrls: ['./new-team-dialog.component.scss']
})
export class NewTeamDialogComponent implements OnInit {
  public currentStep: NewTeamDialogStep;
  public members: NewTeamMember[] = [];

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
    this.members.push(NewTeamMemberBuilder.from(this.data.user.name).withEmail(this.data.user.email).build());
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
      const email = type === 'friend' ? name : null;
      this.members.push(NewTeamMemberBuilder.from(name).withEmail(email).build());
      this.form.get('newMember').reset();
    }
  }

  public changeNewMemberType() {
    this.form.get('newMember').reset();
    this.newMemberInput.nativeElement.focus();
  }

  public removeMember(member: NewTeamMember): void {
    this.members = this.members.filter(
      (m) => m.name.toLocaleLowerCase().trim() !== member.name.toLocaleLowerCase().trim()
    );
  }

  public isCurrentUser(member: NewTeamMember): boolean {
    return member.name.toLocaleLowerCase().trim() === this.data.user.name.toLocaleLowerCase();
  }

  public formatMemberName(member: NewTeamMember): string {
    if (this.isCurrentUser(member)) {
      return `${member.name} (you)`;
    }
    return member.email ? member.email : member.name;
  }

  public shouldSendInvitations(): boolean {
    return this.members.filter((member: NewTeamMember) => !!member.email && !this.isCurrentUser(member)).length > 0;
  }

  public save(): void {
    const result: DialogResult<NewTeamRequest> = {
      payload: NewTeamRequestBuilder.from(this.form.get('name').value.trim(), this.members).build()
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
