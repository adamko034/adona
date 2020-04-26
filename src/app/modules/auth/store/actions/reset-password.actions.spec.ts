import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import {
  resetPasswordActions,
  resetPasswordActionTypes
} from 'src/app/modules/auth/store/actions/reset-password.actions';

describe('Reset Password actions', () => {
  describe('Send Password Reset Email actions', () => {
    it('should create actions', () => {
      expect(resetPasswordActions.sendPasswordResetLinkRequested({ email: 'user@example.com' })).toEqual({
        type: resetPasswordActionTypes.sendPasswordResetLinkRequested,
        email: 'user@example.com'
      });

      expect(resetPasswordActions.sendPasswordResetLinkSuccess()).toEqual({
        type: resetPasswordActionTypes.sendPasswordResetLinkSuccess
      });

      const error = ErrorTestDataBuilder.from().withDefaultData().build();
      expect(resetPasswordActions.sendPasswordResetLinkFailure({ error })).toEqual({
        type: resetPasswordActionTypes.sendPasswordResetLinkFailure,
        error
      });
    });
  });

  describe('Confirm Password Reset actions', () => {
    it('should create actions', () => {
      expect(resetPasswordActions.confirmPasswordResetRequested({ oobCode: '123', newPassword: 'pass1' })).toEqual({
        type: resetPasswordActionTypes.confirmPasswordResetRequested,
        oobCode: '123',
        newPassword: 'pass1'
      });

      expect(resetPasswordActions.confirmPasswordResetSuccess()).toEqual({
        type: resetPasswordActionTypes.confirmPasswordResetSuccess
      });

      const error = ErrorTestDataBuilder.from().withDefaultData().build();
      expect(resetPasswordActions.confirmPasswordResetFailure({ error })).toEqual({
        type: resetPasswordActionTypes.confirmPasswordResetFailure,
        error
      });
    });
  });
});
