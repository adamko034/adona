import { of } from 'rxjs';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { ErrorComponent, ErrorContentComponent } from './error.component';

describe('Error Component', () => {
  let component: ErrorComponent;
  const { errorFacade } = SpiesBuilder.init()
    .withErrorFacade()
    .build();
  const snackBar = jasmine.createSpyObj('SnackBar', ['openFromComponent']);

  beforeEach(() => {
    component = new ErrorComponent(errorFacade, snackBar);

    errorFacade.selectErrors.and.callFake(() => of('This is new error'));

    errorFacade.selectErrors.calls.reset();
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
      expect(errorFacade.selectErrors).toHaveBeenCalledTimes(1);
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
        },
        verticalPosition: 'top'
      });
    });

    it('should not open snack bar if message is null', () => {
      // given
      errorFacade.selectErrors.and.returnValue(of(null));

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
