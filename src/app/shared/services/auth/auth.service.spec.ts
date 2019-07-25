import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';



describe('AuthService', () => {
  let authService: AuthService;
  let fireAuthServiceMock: any;
  let fireAuthSpy: any = {
    auth: jasmine.createSpyObj('auth', {
      'signInWithEmailAndPassword': Promise.resolve({}),
      'signOut': Promise.resolve()
    })
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AuthService, { provide: AngularFireAuth, useValue: fireAuthSpy }] })

    authService = TestBed.get(AuthService);
    fireAuthServiceMock = TestBed.get(AngularFireAuth);
  });

  it('should call fire auth service log in method', () => {
    // given
    const credentials = { email: 'adam', password: 'test' };

    // when
    authService.login(credentials);

    // then
    expect(fireAuthServiceMock.auth.signInWithEmailAndPassword).toHaveBeenCalledWith(credentials.email, credentials.password);
  });

  it('should call fire auth service log out method', () => {
    // when
    authService.logout();

    // then
    expect(fireAuthServiceMock.auth.signOut).toHaveBeenCalledTimes(1);
  })
});
