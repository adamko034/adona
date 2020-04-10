import { firebaseErrorCodes } from 'src/app/core/api-requests/constants/firebase-errors.constants';
import { FirebaseErrorsService } from 'src/app/core/api-requests/services/firebase-errors/firebase-errors.service';

describe('Firebase Errors Service', () => {
  let service: FirebaseErrorsService;

  beforeEach(() => {
    service = new FirebaseErrorsService();
  });

  describe('Is Error Handled', () => {
    for (const errorCode in firebaseErrorCodes) {
      if (firebaseErrorCodes.hasOwnProperty(errorCode)) {
        it(`should handle error code: ${errorCode}`, () => {
          expect(service.isErrorHandled(errorCode)).toEqual(true);
        });
      }
    }

    [
      { errorCode: null, text: 'null' },
      { errorCode: undefined, text: 'undefined' },
      { errorCode: 'unknownError', text: 'unkownError' }
    ].forEach((input) => {
      it(`should not handle ${input.text}`, () => {
        expect(service.isErrorHandled(input.errorCode)).toBeFalse();
      });
    });
  });
});
