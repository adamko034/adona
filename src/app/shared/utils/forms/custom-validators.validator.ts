import { FormControl, FormGroup } from '@angular/forms';
import { TimeService } from '../../services/time/time.service';

export class CustomValidators {
  static requiredValue(control: FormControl) {
    return control.value.trim() !== '' ? null : { requiredValue: { valid: false } };
  }

  static dateBefore = (firstControlName: string, secondControlName: string) => {
    return (form: FormGroup) => {
      const timeService = new TimeService();

      const firstDate = form.get(firstControlName).value;
      const secondDate = form.get(secondControlName).value;

      const isValid = timeService.Comparison.isDateTimeBefore(firstDate, secondDate);

      return isValid ? null : { dateBefore: { valid: false } };
    };
    // tslint:disable-next-line: semicolon
  };
}
