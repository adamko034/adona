import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const firebaseUserCredential = {
    user: UserTestBuilder.withDefaultData().buildFirebaseUser()
  };

  let authService: AuthService;
  const fireAuthSpy: any = {
    auth: jasmine.createSpyObj('auth', {
      signInWithEmailAndPassword: Promise.resolve({}),
      signOut: Promise.resolve(),
      createUserWithEmailAndPassword: Promise.resolve(firebaseUserCredential)
    })
  };
  const { userUtilsService } = SpiesBuilder.init()
    .withUserUtilsService()
    .build();

  beforeEach(() => {
    authService = new AuthService(fireAuthSpy, userUtilsService);
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

  describe('Register', () => {
    beforeEach(() => {
      userUtilsService.extractUsernameFromEmail.calls.reset();
    });

    it('should register in firebase and return Firebase User', done => {
      const credentials = CredentialsBuilder.from(firebaseUserCredential.user.email, '123').build();
      userUtilsService.extractUsernameFromEmail.and.returnValue(firebaseUserCredential.user.email.split('@')[0]);
      firebaseUserCredential.user.updateProfile.and.returnValue(Promise.resolve());

      authService.register(credentials).subscribe(resData => {
        expect(resData).toEqual(firebaseUserCredential.user);
        JasmineCustomMatchers.toHaveBeenCalledTimesWith(
          fireAuthSpy.auth.createUserWithEmailAndPassword,
          1,
          credentials.email,
          credentials.password
        );

        JasmineCustomMatchers.toHaveBeenCalledTimesWith(firebaseUserCredential.user.updateProfile, 1, {
          displayName: firebaseUserCredential.user.displayName
        });

        done();
      });
    });
  });
});
