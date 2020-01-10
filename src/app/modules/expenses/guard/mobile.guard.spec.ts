import { cold, hot } from 'jasmine-marbles';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { MobileGuard } from './mobile.guard';

describe('Mobile Guard', () => {
  let guard: MobileGuard;

  const { navigationService, deviceDetectorService, expensesFacade } = SpiesBuilder.init()
    .withDeviceDetectorService()
    .withExpensesFacade()
    .withNavigationService()
    .build();

  beforeEach(() => {
    guard = new MobileGuard(deviceDetectorService, navigationService, expensesFacade);

    navigationService.toExpensesDesktop.calls.reset();
    navigationService.toExpensesMobile.calls.reset();
    expensesFacade.getExpensesLoaded.calls.reset();
  });

  describe('Can Activate', () => {
    describe('On Desktop', () => {
      ['/expenses/d', '/expenses/d/', '/expenses/d/1'].forEach(url => {
        it(`should return true when on desktop and url is: ${url}`, () => {
          // given
          const state: any = { url };
          deviceDetectorService.isMobile.and.returnValue(false);

          // when
          const result = guard.canActivate(null, state);

          // then
          expect(result).toBeTruthy();
          expect(navigationService.toExpensesDesktop).not.toHaveBeenCalled();
          expect(navigationService.toExpensesMobile).not.toHaveBeenCalled();
          expect(expensesFacade.getExpensesLoaded).not.toHaveBeenCalled();
        });
      });

      ['/expenses/m', '/expenses/m/', '/expenses/m/1'].forEach(url => {
        it(`should return false and navigate to desktop when on deskotp and url is: ${url}`, () => {
          // given
          const state: any = { url };
          deviceDetectorService.isMobile.and.returnValue(false);
          const expectedParams = url.endsWith('1') ? '1' : '';

          // when
          const result = guard.canActivate(null, state);

          // then
          expect(result).toBeFalsy();
          expect(navigationService.toExpensesDesktop).toHaveBeenCalledTimes(1);
          expect(navigationService.toExpensesDesktop).toHaveBeenCalledWith(expectedParams);
          expect(navigationService.toExpensesMobile).not.toHaveBeenCalled();
          expect(expensesFacade.getExpensesLoaded).not.toHaveBeenCalled();
        });
      });
    });

    describe('On Mobile', () => {
      it('should return true when on mobile and url is /expenses/m ', () => {
        // given
        const state: any = { url: '/expenses/m' };
        deviceDetectorService.isMobile.and.returnValue(true);

        // when
        const result = guard.canActivate(null, state);

        // then
        expect(result).toBeTruthy();
        expect(navigationService.toExpensesDesktop).not.toHaveBeenCalled();
        expect(navigationService.toExpensesMobile).not.toHaveBeenCalled();
        expect(expensesFacade.getExpensesLoaded).not.toHaveBeenCalled();
      });

      it('should return false and navigate to mobile when on mobile and url is /expenses/d', () => {
        // given
        const state: any = { url: '/expenses/d' };
        deviceDetectorService.isMobile.and.returnValue(true);

        // when
        const result = guard.canActivate(null, state);

        // then
        expect(result).toBeFalsy();
        expect(navigationService.toExpensesDesktop).not.toHaveBeenCalled();
        expect(navigationService.toExpensesMobile).toHaveBeenCalledTimes(1);
        expect(expensesFacade.getExpensesLoaded).not.toHaveBeenCalled();
      });

      it('should return false and navigate to mobile with params when on mobile and url is /expenses/d/1', () => {
        // given
        const state: any = { url: '/expenses/d/1' };
        deviceDetectorService.isMobile.and.returnValue(true);

        // when
        const result = guard.canActivate(null, state);

        // then
        expect(result).toBeFalsy();
        expect(navigationService.toExpensesDesktop).not.toHaveBeenCalled();
        expect(navigationService.toExpensesMobile).toHaveBeenCalledTimes(1);
        expect(navigationService.toExpensesMobile).toHaveBeenCalledWith('1');
        expect(expensesFacade.getExpensesLoaded).not.toHaveBeenCalled();
      });

      it('should return true when on mobile, url is: /expenses/m/1 and expenses are loaded', () => {
        // given
        const state: any = { url: '/expenses/m/1' };
        deviceDetectorService.isMobile.and.returnValue(true);
        expensesFacade.getExpensesLoaded.and.returnValue(hot('b', { b: true }));
        const expected = cold('a', { a: true });

        // when
        const result = guard.canActivate(null, state);

        // then
        expect(result).toBeObservable(expected);
        expect(navigationService.toExpensesDesktop).not.toHaveBeenCalled();
        expect(navigationService.toExpensesMobile).not.toHaveBeenCalled();
        expect(expensesFacade.getExpensesLoaded).toHaveBeenCalledTimes(1);
      });

      it('should return false when on mobile and navigate to expenses list when url is: /expenses/m/1 and expenses are not loaded', () => {
        // given
        const state: any = { url: '/expenses/m/1' };
        deviceDetectorService.isMobile.and.returnValue(true);
        expensesFacade.getExpensesLoaded.and.returnValue(hot('b', { b: false }));
        const expected = cold('a', { a: false });

        // when
        const result = guard.canActivate(null, state);

        // then
        expect(result).toBeObservable(expected);
        expect(navigationService.toExpensesDesktop).not.toHaveBeenCalled();
        expect(navigationService.toExpensesMobile).toHaveBeenCalledTimes(1);
        expect(navigationService.toExpensesMobile).toHaveBeenCalledWith();
        expect(expensesFacade.getExpensesLoaded).toHaveBeenCalledTimes(1);
      });
    });
  });
});
