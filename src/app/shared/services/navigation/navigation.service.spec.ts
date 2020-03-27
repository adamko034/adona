import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let navigationService: NavigationService;
  const routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

  beforeEach(() => {
    navigationService = new NavigationService(routerMock);

    routerMock.navigate.calls.reset();
  });

  it('should navigate to login route', () => {
    // given
    const loginRoute = '/login';

    // when
    navigationService.toLogin();

    // then
    expect(routerMock.navigate).toHaveBeenCalledWith([loginRoute]);
  });

  it('should navigate to home page', () => {
    // given
    const homeRoute = '/home';

    // when
    navigationService.toHome();

    // then
    expect(routerMock.navigate).toHaveBeenCalledWith([homeRoute]);
  });

  it('should navigate to Verify Email page', () => {
    // given
    const route = '/login/verifyEmail';

    // when
    navigationService.toVerifyEmail();

    // then
    expect(routerMock.navigate).toHaveBeenCalledWith([route]);
  });

  it('should navigate to expenses mobile page', () => {
    // given
    const route = '/expenses/m/';

    // when
    navigationService.toExpensesMobile();

    // then
    expect(routerMock.navigate).toHaveBeenCalledWith([route]);
  });

  it('should navigate to expenses mobile page with paramas', () => {
    // given
    const route = '/expenses/m/2';

    // when
    navigationService.toExpensesMobile('2');

    // then
    expect(routerMock.navigate).toHaveBeenCalledWith([route]);
  });

  it('should navigate to expenses desktop page', () => {
    // given
    const route = '/expenses/d/';

    // when
    navigationService.toExpensesDesktop();

    // then
    expect(routerMock.navigate).toHaveBeenCalledWith([route]);
  });

  it('should navigate to expenses desktop page with params', () => {
    // given
    const route = '/expenses/d/2';

    // when
    navigationService.toExpensesDesktop('2');

    // then
    expect(routerMock.navigate).toHaveBeenCalledWith([route]);
  });

  it('should navigate to expenses content page', () => {
    // given
    const homeRoute = '/expenses/d/1';

    // when
    navigationService.toExpenseContent('1');

    // then
    expect(routerMock.navigate).toHaveBeenCalledWith([homeRoute]);
  });
});
