import { NewTeamDialogStep } from '../models/new-team-dialog-step.enum';
import { NewTeamDialogStepsHelper } from './new-team-dialog-steps-helper.service';

describe('New Team Dialog Steps Helper Service', () => {
  let service: NewTeamDialogStepsHelper;

  beforeEach(() => {
    service = new NewTeamDialogStepsHelper();
  });

  describe('Get Next Step', () => {
    [
      { current: NewTeamDialogStep.Name, expected: NewTeamDialogStep.Users },
      { current: NewTeamDialogStep.Users, expected: NewTeamDialogStep.Summary },
      { current: NewTeamDialogStep.Summary, expected: NewTeamDialogStep.Summary }
    ].forEach(input => {
      it(`should return ${input.expected} for ${input.current}`, () => {
        expect(service.getNextStep(input.current)).toEqual(input.expected);
      });
    });
  });

  describe('Get Previous Step', () => {
    [
      { current: NewTeamDialogStep.Name, expected: NewTeamDialogStep.Name },
      { current: NewTeamDialogStep.Users, expected: NewTeamDialogStep.Name },
      { current: NewTeamDialogStep.Summary, expected: NewTeamDialogStep.Users }
    ].forEach(input => {
      it(`should return ${input.expected} for ${input.current}`, () => {
        expect(service.getPreviousStep(input.current)).toEqual(input.expected);
      });
    });
  });
});
