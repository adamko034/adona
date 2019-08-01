import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';

describe('NavigationService', () => {
  const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
  let navigationService: NavigationService;
  let routerMock;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NavigationService, { provide: Router, useValue: routerSpyObj }] });
    navigationService = TestBed.get(NavigationService);
    routerMock = TestBed.get(Router);
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
    const homeRoute = '/home/calendar';

    // when
    navigationService.toHome();

    // then
    expect(routerMock.navigate).toHaveBeenCalledWith([homeRoute]);
  });
});
