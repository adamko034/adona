import { of } from 'rxjs';
import { ErrorContentComponent } from 'src/app/shared/components/error/error-content/error-content.component';
import { ErrorComponent } from 'src/app/shared/components/error/error.component';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';

describe('Error Component', () => {
  let component: ErrorComponent;
  const { errorFacade } = SpiesBuilder.init().withErrorFacade().build();
  const snackBar = jasmine.createSpyObj('SnackBar', ['openFromComponent']);

  beforeEach(() => {
    component = new ErrorComponent(errorFacade, snackBar);

    errorFacade.selectError.and.callFake(() => of('This is new error'));

    errorFacade.selectError.calls.reset();
    snackBar.openFromComponent.calls.reset();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  describe('On Init', () => {
    it('should subscribe to errors from facade', () => {
      // when
      component.ngOnInit();

      // then
      expect(errorFacade.selectError).toHaveBeenCalledTimes(1);
    });

    it('should open snack bar if new error occurs', () => {
      // when
      component.ngOnInit();

      // then
      expect(snackBar.openFromComponent).toHaveBeenCalledTimes(1);
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(ErrorContentComponent, {
        duration: 5 * 60 * 1000,
        data: {
          message: 'This is new error'
        },
        verticalPosition: 'top'
      });
    });

    it('should not open snack bar if message is null', () => {
      // given
      errorFacade.selectError.and.returnValue(of(null));

      // when
      component.ngOnInit();

      // then
      expect(snackBar.openFromComponent).not.toHaveBeenCalled();
    });
  });

  describe('On Destroy', () => {
    it('should unsubscribe subscriptions', () => {
      // given
      component.ngOnInit();
      const errorSubscriptionSpy = spyOn((component as any).errorsSubscription, 'unsubscribe');

      // when
      component.ngOnDestroy();

      // then
      expect(errorSubscriptionSpy).toHaveBeenCalledTimes(1);
    });
  });
});
