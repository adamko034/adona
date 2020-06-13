import { ClearToastrGuard } from 'src/app/core/gui/guards/clear-toastr/clear-toastr.guard';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Clear Toastr Guard', () => {
  let guard: ClearToastrGuard;

  const { guiFacade } = SpiesBuilder.init().withGuiFacade().build();

  beforeEach(() => {
    guard = new ClearToastrGuard(guiFacade);

    guiFacade.clearToastr.calls.reset();
  });

  describe('Can Activate', () => {
    it('should call Clear Toastr and return true', () => {
      expect(guard.canActivate()).toBeTrue();
      expect(guiFacade.clearToastr).toHaveBeenCalledTimes(1);
    });
  });
});
