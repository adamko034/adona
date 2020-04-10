import { of } from 'rxjs';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { ApiRequestStatusBuilder } from 'src/app/core/api-requests/models/api-request-status/api-request-status.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { SpiesBuilder } from '../../../../utils/testUtils/builders/spies.builder';
import { VerifyEmailComponent } from './verify-email.component';

describe('Verify Email Component', () => {
  let component: VerifyEmailComponent;

  const {
    registerFacade,
    unsubscriberService,
    apiRequestsFacade
  } = SpiesBuilder.init().withApiRequestsFacade().withRegisterFacade().withUnsubscriberService().build();

  beforeEach(() => {
    component = new VerifyEmailComponent(registerFacade, unsubscriberService, apiRequestsFacade);
  });

  describe('Constructor', () => {
    it('should create unsubscriber', () => {
      unsubscriberService.create.calls.reset();
      component = new VerifyEmailComponent(registerFacade, unsubscriberService, apiRequestsFacade);

      expect(unsubscriberService.create).toHaveBeenCalled();
    });
  });

  describe('On Init', () => {
    it('shuold subscibe to api request status', () => {
      apiRequestsFacade.selectApiRequest.and.returnValue(of(ApiRequestStatusBuilder.start('1')));

      component.ngOnInit();

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        apiRequestsFacade.selectApiRequest,
        1,
        apiRequestIds.sendEmailVerificationLink
      );
      expect(component.apiRequestStatus).toEqual(ApiRequestStatusBuilder.start('1'));
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe from subscriptions', () => {
      component.ngOnDestroy();

      expect(unsubscriberService.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Send Email Confirmation Link', () => {
    it('should send email confirmation link', () => {
      component.sendEmailConfirmationLink();

      expect(registerFacade.sendEmailVerificationLink).toHaveBeenCalledTimes(1);
    });
  });
});
