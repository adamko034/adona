import { ErrorTestDataBuilder } from 'src/app/core/error/utils/test/error-test-data.builder';
import { verifyEmailAcionTypes, verifyEmailActions } from 'src/app/modules/auth/store/actions/verify-email.actions';

describe('Verify Email actions', () => {
  describe('Send Email Verification Link actions', () => {
    it('should create actions', () => {
      expect(verifyEmailActions.sendEmailVerificationLinkRequested()).toEqual({
        type: verifyEmailAcionTypes.sendEmailVerificationLinkRequested
      });

      expect(verifyEmailActions.sendEmailVerificationLinkSuccess()).toEqual({
        type: verifyEmailAcionTypes.sendEmailVerificationLinkSuccess
      });

      const error = ErrorTestDataBuilder.from().withDefaultData().build();
      expect(verifyEmailActions.sendEmailVerificationLinkFailure({ error })).toEqual({
        type: verifyEmailAcionTypes.sendEmailVerificationLinkFailure,
        error
      });
    });
  });

  describe('Confirm Email actions', () => {
    it('should create actions', () => {
      expect(verifyEmailActions.confirmEmailRequested({ code: '123' })).toEqual({
        type: verifyEmailAcionTypes.confirmEmailRequested,
        code: '123'
      });

      expect(verifyEmailActions.confirmEmailSuccess()).toEqual({
        type: verifyEmailAcionTypes.confirmEmailSuccess
      });

      const error = ErrorTestDataBuilder.from().withDefaultData().build();
      expect(verifyEmailActions.confirmEmailFailure({ error })).toEqual({
        type: verifyEmailAcionTypes.confirmEmailFailure,
        error
      });
    });
  });
});
