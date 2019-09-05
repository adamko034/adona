import { of } from 'rxjs';
import { ErrorComponent, ErrorContentComponent } from './error.component';

describe('Error Component', () => {
  let component: ErrorComponent;
  const errorFacade = jasmine.createSpyObj('ErrorFacade', ['getErrors']);
  const snackBar = jasmine.createSpyObj('SnackBar', ['openFromComponent']);

  beforeEach(() => {
    component = new ErrorComponent(errorFacade, snackBar);

    errorFacade.getErrors.and.callFake(() => of('This is new error'));

    errorFacade.getErrors.calls.reset();
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
      expect(errorFacade.getErrors).toHaveBeenCalledTimes(1);
    });

    it('should open snack bar if new error occurs', () => {
      // when
      component.ngOnInit();

      // then
      expect(snackBar.openFromComponent).toHaveBeenCalledTimes(1);
      expect(snackBar.openFromComponent).toHaveBeenCalledWith(ErrorContentComponent, {
        duration: 5 * 1000,
        data: {
          message: 'This is new error'
        }
      });
    });

    it('should not open snack bar if message is null', () => {
      // given
      errorFacade.getErrors.and.returnValue(of(null));

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
