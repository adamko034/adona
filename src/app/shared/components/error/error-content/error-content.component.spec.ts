import { ErrorContentComponent } from 'src/app/shared/components/error/error-content/error-content.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Error Content Component', () => {
  let component: ErrorContentComponent;

  const { errorFacade } = SpiesBuilder.init().withErrorFacade().build();
  const snackBarRef: any = {};
  const data = { message: 'This is snack bar' };

  beforeEach(() => {
    component = new ErrorContentComponent(errorFacade, snackBarRef, data);
  });

  describe('On Destroy', () => {
    it('should clear error', () => {
      component.ngOnDestroy();

      expect(errorFacade.clearError).toHaveBeenCalledTimes(1);
    });
  });
});
