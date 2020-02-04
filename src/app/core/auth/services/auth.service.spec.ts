import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const fireAuthSpy: any = {
    auth: jasmine.createSpyObj('auth', {
      signInWithEmailAndPassword: Promise.resolve({}),
      signOut: Promise.resolve()
    })
  };

  beforeEach(() => {
    authService = new AuthService(fireAuthSpy);
  });

  it('should call fireauth service login method', () => {
    // given
    const credentials = { email: 'adam', password: 'test' };

    // when
    authService.login(credentials);

    // then
    expect(fireAuthSpy.auth.signInWithEmailAndPassword).toHaveBeenCalledWith(credentials.email, credentials.password);
  });

  it('should call fireauth service logout method', () => {
    // when
    authService.logout();

    // then
    expect(fireAuthSpy.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
