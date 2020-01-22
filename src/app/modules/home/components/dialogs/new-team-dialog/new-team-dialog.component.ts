import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewTeamRequest } from '../../../../../core/user/model/new-team-request.model';
import { User } from '../../../../../core/user/model/user-model';
import { UserUtilservice } from '../../../../../core/user/services/user-utils.service';
import { DialogResult } from '../../../../../shared/services/dialogs/dialog-result.model';
import { NewEventDialogComponent } from '../../../../calendar/components/dialogs/new-event-dialog/new-event-dialog.component';
import { Team } from '../../../model/team.model';
import { NewTeamDialogStep } from './models/new-team-dialog-step.enum';
import { NewTeamDialogStepsHelper } from './service/new-team-dialog-steps-helper.service';

@Component({
  selector: 'app-new-team-dialog',
  templateUrl: './new-team-dialog.component.html',
  styleUrls: ['./new-team-dialog.component.scss']
})
export class NewTeamDialogComponent implements OnInit {
  private newMemberInputRef: ElementRef;

  @ViewChild('newMemberInput', { static: false }) set controlElRef(elementRef: ElementRef) {
    this.newMemberInputRef = elementRef;
  }

  public currentStep: NewTeamDialogStep;
  public members: string[];

  public steps = NewTeamDialogStep;
  public form: FormGroup = new FormGroup({
    name: new FormControl(this.data.team.name),
    newUser: new FormControl()
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User; team: Team },
    private dialogRef: MatDialogRef<NewEventDialogComponent>,
    private stepsService: NewTeamDialogStepsHelper,
    private userUtils: UserUtilservice
  ) {}

  public ngOnInit() {
    this.currentStep = this.steps.Name;
    this.members = [this.data.user.name];
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
      this.members.push(this.form.get('newUser').value.trim());
      this.form.get('newUser').setValue('');
    }
  }

  public removeMember(memberName: string) {
    if (memberName.toLocaleLowerCase().trim() !== 'you') {
      this.members = this.members.filter(member => member !== memberName);
    }
  }

  public isCurrentUser(memberName: string): boolean {
    return memberName.toLocaleLowerCase().trim() === this.data.user.name.toLocaleLowerCase();
  }

  public formatMemberName(memberName: string): string {
    return this.isCurrentUser(memberName) ? `${memberName} (you)` : memberName;
  }

  public save() {
    if (this.validateTeamName()) {
      const result: DialogResult<NewTeamRequest> = {
        payload: {
          name: this.form.get('name').value.trim(),
          members: this.members.filter(member => !this.isCurrentUser(member))
        }
      };

      this.dialogRef.close(result);
    }
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

    if (this.members.findIndex(member => member.toLowerCase().trim() === value.toLowerCase().trim()) >= 0) {
      this.form.get('newUser').setErrors({ nameExists: true });
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

    if (this.userUtils.belongsToTeam(this.data.user, value)) {
      this.form.get('name').setErrors({ nameExists: true });
      return false;
    }

    return true;
  }
}
