import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request.model';
import { TeamMember } from 'src/app/core/team/model/team-member.model';
import { User } from '../../../../../core/user/model/user.model';
import { DialogResult } from '../../../../../shared/services/dialogs/dialog-result.model';
import { NewEventDialogComponent } from '../../../../calendar/components/dialogs/new-event-dialog/new-event-dialog.component';
import { NewTeamDialogStep } from './models/new-team-dialog-step.enum';
import { NewTeamDialogStepsHelper } from './service/new-team-dialog-steps-helper.service';

@Component({
  selector: 'app-new-team-dialog',
  templateUrl: './new-team-dialog.component.html',
  styleUrls: ['./new-team-dialog.component.scss']
})
export class NewTeamDialogComponent implements OnInit {
  private newMemberInputRef: ElementRef;

  @ViewChild('newMemberInput') set controlElRef(elementRef: ElementRef) {
    this.newMemberInputRef = elementRef;
  }

  public currentStep: NewTeamDialogStep;
  public members: { [name: string]: TeamMember } = {};

  public steps = NewTeamDialogStep;
  public form: FormGroup = new FormGroup({
    name: new FormControl(),
    isDefault: new FormControl(false),
    newUser: new FormControl()
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<NewEventDialogComponent>,
    private stepsService: NewTeamDialogStepsHelper
  ) {}

  public ngOnInit() {
    this.currentStep = this.steps.Name;
    this.members[this.data.user.name] = { name: this.data.user.name };
  }

  public nextStep() {
    if (this.isStepValid()) {
      this.currentStep = this.stepsService.getNextStep(this.currentStep);

      if (this.currentStep === this.steps.Users) {
        setTimeout(() => {
          this.newMemberInputRef.nativeElement.focus();
        });
      }
    }
  }

  public previousStep() {
    this.currentStep = this.stepsService.getPreviousStep(this.currentStep);
  }

  public addNewMember() {
    if (this.validateMemberName()) {
      const name = this.form.get('newUser').value.trim();
      this.members[name] = { name };
      this.form.get('newUser').setValue('');
    }
  }

  public removeMember(memberName: string) {
    if (memberName.toLocaleLowerCase().trim() !== 'you') {
      delete this.members[memberName];
    }
  }

  public isCurrentUser(memberName: string): boolean {
    return memberName.toLocaleLowerCase().trim() === this.data.user.name.toLocaleLowerCase();
  }

  public formatMemberName(memberName: string): string {
    return this.isCurrentUser(memberName) ? `${memberName} (you)` : memberName;
  }

  public getMembersCount(): number {
    return Object.keys(this.members).length;
  }

  public save() {
    if (this.validateTeamName()) {
      const result: DialogResult<NewTeamRequest> = {
        payload: {
          name: this.form.get('name').value.trim(),
          created: new Date(),
          createdBy: this.data.user.name,
          members: this.members
        }
      };

      this.dialogRef.close(result);
    }
  }

  public close() {
    this.dialogRef.close(null);
  }

  private isStepValid() {
    switch (this.currentStep) {
      case this.steps.Name:
        return this.validateTeamName();
      default:
        return true;
    }
  }

  private validateMemberName(): boolean {
    const value = this.form.get('newUser').value;

    if (!value) {
      this.form.get('newUser').setErrors({ required: true });
      return false;
    }

    return true;
  }

  private validateTeamName(): boolean {
    const value = this.form.get('name').value;

    if (!value) {
      this.form.get('name').setErrors({ required: true });
      return false;
    }

    return true;
  }
}
