import { firebaseAuthErrorCodes } from 'src/app/core/api-requests/constants/firebase-errors.constants';
import { adonaAuthErrorCodes } from 'src/app/modules/auth/constants/adona-auth-error-codes.constants';

export const authErrorMessages: { [key: string]: string } = {
  [firebaseAuthErrorCodes.emailAlreadyInUse]: '{1} email address is already in use.',
  [firebaseAuthErrorCodes.invalidEmail]: 'Provided email is invalid. Please, correct it and try again.',
  [firebaseAuthErrorCodes.weakPassword]: 'Provided password is invalid. Please, stick to the password constraints.',
  [firebaseAuthErrorCodes.networkFailure]: 'Network failure occured. Please, check your internet connection.',
  [firebaseAuthErrorCodes.oobCodeExpired]: 'Your session has expired.',
  [firebaseAuthErrorCodes.oobCodeInvalid]: 'The session is not valid.',
  [firebaseAuthErrorCodes.userDisabled]: 'Your account is disabled. Please contact us!',
  [firebaseAuthErrorCodes.userNotFound]:
    'Your account has not been found. If you think this is incorrect situation, feel free to contact us, otherwise register a new account.',
  [adonaAuthErrorCodes.invalidSession]:
    'Your session for reseting password has expired or is invalid. Please, go to the login page and try to reset your password again.'
};
