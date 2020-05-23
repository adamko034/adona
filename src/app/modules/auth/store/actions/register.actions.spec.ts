import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { registerActions, registerActionTypes } from 'src/app/modules/auth/store/actions/register.actions';

describe('Register Actions', () => {
  it('should create Register Requested action', () => {
    const cred = CredentialsBuilder.from('user@example.com', 'pass1').build();
    expect(registerActions.registerRequested({ credentials: cred, invitationId: null })).toEqual({
      type: registerActionTypes.registerRequested,
      credentials: cred,
      invitationId: null
    });
  });

  it('should create Register Succes action', () => {
    expect(registerActions.registerSuccess()).toEqual({ type: registerActionTypes.registerSuccess });
  });

  it('should create Register Failure action', () => {
    const error = ErrorTestDataBuilder.from().withDefaultData().build();
    expect(registerActions.registerFailure({ error })).toEqual({ type: registerActionTypes.registerFailure, error });
  });
});
