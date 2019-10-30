import { FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from './custom-validators.validator';

describe('Custom Validators', () => {
  describe('Required Value', () => {
    [
      { control: { value: 'test' }, expected: null },
      { control: { value: '' }, expected: { requiredValue: { valid: false } } }
    ].forEach(input => {
      it(`shoult return ${input.expected} for value ${input.control.value}`, () => {
        // when
        const actual = CustomValidators.requiredValue(input.control as any);

        // then
        expect(actual).toEqual(input.expected);
      });
    });
  });

  describe('Date Before', () => {
    [
      { dateOne: new Date(2019, 9, 1, 10, 15), dateTwo: new Date(2019, 9, 3, 10, 15), expected: null },
      {
        dateOne: new Date(2019, 9, 5, 10, 15),
        dateTwo: new Date(2019, 9, 3, 10, 15),
        expected: { dateBefore: { valid: false } }
      }
    ].forEach(input => {
      it(`should return ${input.expected} for date ${input.dateOne} before ${input.dateTwo}`, () => {
        // given
        const formGroup = new FormGroup({
          first: new FormControl(input.dateOne),
          second: new FormControl(input.dateTwo)
        });

        // when
        const actual = CustomValidators.dateBefore('first', 'second')(formGroup);

        // then
        expect(actual).toEqual(input.expected);
      });
    });
  });
});
