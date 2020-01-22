import { Injectable } from '@angular/core';
import { NewTeamDialogStep } from '../models/new-team-dialog-step.enum';

@Injectable({ providedIn: 'root' })
export class NewTeamDialogStepsHelper {
  private readonly nextSteps: { [current: string]: NewTeamDialogStep } = {
    [NewTeamDialogStep.Name.toString()]: NewTeamDialogStep.Users,
    [NewTeamDialogStep.Users.toString()]: NewTeamDialogStep.Summary,
    [NewTeamDialogStep.Summary.toString()]: null
  };

  private readonly previousSteps: { [current: string]: NewTeamDialogStep } = {
    [NewTeamDialogStep.Summary.toString()]: NewTeamDialogStep.Users,
    [NewTeamDialogStep.Users.toString()]: NewTeamDialogStep.Name,
    [NewTeamDialogStep.Name.toString()]: null
  };

  public getNextStep(current: NewTeamDialogStep): NewTeamDialogStep {
    const nextStep = this.nextSteps[current.toString()];

    return nextStep === null ? current : nextStep;
  }

  public getPreviousStep(current: NewTeamDialogStep): NewTeamDialogStep {
    const prevStep = this.previousSteps[current.toString()];

    return prevStep === null ? current : prevStep;
  }
}
