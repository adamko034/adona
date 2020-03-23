const emailExistsCode = 'auth/email-already-in-use';
const formInvalidCode = 'adona/form-invalid';
const emailInvalidCode = 'auth/invalid-email';
const passwordInvalidCode = 'auth/weak-password';
const unknownErrorCode = 'adona/unkown';
const passwordsDoNotMatchErrorCode = 'adona/passwords-incorrect';

export const registrationErrorCodes = {
  emailExists: emailExistsCode,
  formInvalid: formInvalidCode,
  emailInvalid: emailInvalidCode,
  passwordInvalid: passwordInvalidCode,
  unknown: unknownErrorCode,
  passwordsDoNotMatch: passwordsDoNotMatchErrorCode
};

export const registrationErrorMessages: { [key: string]: string } = {
  [emailExistsCode]: '{1} email address is already in use.',
  [formInvalidCode]: 'Incorrect form data.',
  [emailInvalidCode]: 'Provided email is invalid. Please, correct it and try again.',
  [passwordInvalidCode]: 'Provided password is invalid. Please, stick to the password constraints.',
  [unknownErrorCode]: 'Unknown error occured. Please, try again later.',
  [passwordsDoNotMatchErrorCode]: 'Passwords do not match.'
};
