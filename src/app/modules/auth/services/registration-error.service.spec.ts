import { cold } from 'jasmine-marbles';
import { Subject } from 'rxjs';
import {
  registrationErrorCodes,
  registrationErrorMessages
} from 'src/app/modules/auth/constants/registration-error-messages.constants';
import { RegistrationErrorBuilder } from 'src/app/modules/auth/models/registration/registration-error.builder';
import { RegistrationError } from 'src/app/modules/auth/models/registration/registration-error.model';
import { RegistrationErrorService } from 'src/app/modules/auth/services/registration-error.service';

describe('Registration Error Service', () => {
  let service: RegistrationErrorService;

  beforeEach(() => {
    service = new RegistrationErrorService();
  });

  describe('Push', () => {
    [registrationErrorCodes.emailExists, null, 'incorrectCode'].forEach(code => {
      it(`should push error code: ${code || 'null'}`, () => {
        const expected = createRegistrationError(code);

        service.push(registrationErrorCodes.emailExists);

        const subscription = service.selectErrors().subscribe(error => {
          expect(error).toEqual(expected);
        });

        expect(subscription).toBeTruthy();
        subscription.unsubscribe();
      });
    });
  });

  describe('Select Errors', () => {
    it('should create if null', () => {
      (service as any).errors$ = undefined;

      expect(service.selectErrors()).toBeTruthy();
    });

    it('should return observable of values', () => {
      const expected = cold('a-b-c', {
        a: createRegistrationError(registrationErrorCodes.emailExists),
        b: createRegistrationError(null),
        c: createRegistrationError('incorrectCode')
      });

      (service as any).errors$ = jasmine.createSpyObj<Subject<RegistrationError>>('errors', ['asObservable']);
      (service as any).errors$.asObservable.and.returnValue(expected);

      expect(service.selectErrors()).toBeObservable(expected);
    });
  });
});

function createRegistrationError(code): RegistrationError {
  const message =
    code === 'incorrectCode'
      ? registrationErrorMessages[registrationErrorCodes.unknown]
      : registrationErrorMessages[code];
  return code ? RegistrationErrorBuilder.from(code, message).build() : null;
}
