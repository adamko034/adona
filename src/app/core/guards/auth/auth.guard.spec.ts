import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from './../../../shared/services/auth/auth.service';
import { AuthGuard } from './auth.guard';

function makeAuthServiceMock(authState: any) {
  return {
    authState$: of(authState)
  };
}

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: makeAuthServiceMock(true) }
      ]
    });
  });
});
