export const firebaseAuthErrorCodes = {
  emailAlreadyInUse: 'auth/email-already-in-use',
  invalidEmail: 'auth/invalid-email',
  weakPassword: 'auth/weak-password',
  networkFailure: 'auth/network-request-failed',
  oobCodeExpired: 'auth/expired-action-code',
  oobCodeInvalid: 'auth/invalid-action-code',
  userDisabled: 'auth/user-disabled',
  userNotFound: 'auth/user-not-found'
};

export const firebaseErrorCodes: { [code: string]: boolean } = {
  [firebaseAuthErrorCodes.emailAlreadyInUse]: true,
  [firebaseAuthErrorCodes.invalidEmail]: true,
  [firebaseAuthErrorCodes.weakPassword]: true,
  [firebaseAuthErrorCodes.networkFailure]: true,
  [firebaseAuthErrorCodes.oobCodeExpired]: true,
  [firebaseAuthErrorCodes.oobCodeInvalid]: true,
  [firebaseAuthErrorCodes.userDisabled]: true,
  [firebaseAuthErrorCodes.userNotFound]: true
};
