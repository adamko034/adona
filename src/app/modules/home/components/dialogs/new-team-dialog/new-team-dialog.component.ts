import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../../../core/user/model/user-model';
import { UserUtilservice } from '../../../../../core/user/services/user-utils.service';
import { Team } from '../../../model/team.model';
import { NewTeamDialogStep } from './models/new-team-dialog-step.enum';
import { NewTeamDialogStepsHelper } from './service/new-team-dialog-steps-helper.service';

@Component({
  selector: 'app-new-team-dialog',
  templateUrl: './new-team-dialog.component.html',
  styleUrls: ['./new-team-dialog.component.css']
})
export class NewTeamDialogComponent implements OnInit {
  public currentStep: NewTeamDialogStep;
  public members: User[];

  public steps = NewTeamDialogStep;
  public form: FormGroup = new FormGroup({
    name: new FormControl(this.data.team.name),
    newUser: new FormControl()
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User; team: Team },
    private stepsService: NewTeamDialogStepsHelper,
    private userUtils: UserUtilservice
  ) {}

  public ngOnInit() {
    this.currentStep = this.steps.Name;
    this.members = [];
  }

  public nextStep() {
    if (this.isStepValid()) {
      this.currentStep = this.stepsService.getNextStep(this.currentStep);
    }
  }

  public previousStep() {
    this.currentStep = this.stepsService.getPreviousStep(this.currentStep);
  }

  public addNewMember() {}

  private isStepValid() {
    switch (this.currentStep) {
      case this.steps.Name:
        return this.validateTeamName();
    }
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
