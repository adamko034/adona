import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, createAction } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { apiRequestIds } from 'src/app/core/api-requests/constants/api-request-ids.contants';
import { CredentialsBuilder } from 'src/app/core/auth/model/builder/credentials.builder';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Error } from 'src/app/core/error/model/error.model';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { NewTeamMemberBuilder } from 'src/app/core/team/model/new-team-request/new-team-member.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { UserBuilder } from 'src/app/core/user/model/user/user.builder';
import { UserService } from 'src/app/core/user/services/user.service';
import { EmailConfirmationService } from 'src/app/modules/auth/services/email-confirmation.service';
import { registerActions } from 'src/app/modules/auth/store/actions/register.actions';
import { RegisterEffects } from 'src/app/modules/auth/store/effects/register.effects';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { UserTestBuilder } from 'src/app/utils/testUtils/builders/user-test-builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Register Effecs', () => {
  const mockDate = new Date();
  let actions$: Observable<Action>;
  let effects: RegisterEffects;

  const firebaseUser = UserTestBuilder.withDefaultData().buildFirebaseUser();
  const user = UserBuilder.from(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName, [])
    .withPhotoUrl(UserBuilder.defaultPhotoUrl)
    .build();

  const {
    authService,
    emailConfirmationService,
    userService,
    navigationService,
    apiRequestsFacade,
    errorEffectService
  } = SpiesBuilder.init()
    .withAuthService()
    .withEmailConfirmationService()
    .withUserService()
    .withErrorEffectService()
    .withApiRequestsFacade()
    .withNavigationService()
    .build();

  beforeAll(() => {
    jasmine.clock().mockDate(mockDate);
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        RegisterEffects,
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService },
        { provide: EmailConfirmationService, useValue: emailConfirmationService },
        { provide: ApiRequestsFacade, useValue: apiRequestsFacade },
        { provide: NavigationService, useValue: navigationService },
        { provide: ErrorEffectService, useValue: errorEffectService }
      ]
    });

    effects = TestBed.inject<RegisterEffects>(RegisterEffects);

    authService.register.calls.reset();
    userService.createUser.calls.reset();
    emailConfirmationService.send.calls.reset();
    apiRequestsFacade.startRequest.calls.reset();
  });

  describe('Register Requested', () => {
    let teamRequest: NewTeamRequest;
    beforeEach(() => {
      teamRequest = {
        created: mockDate,
        name: 'Personal',
        members: [
          NewTeamMemberBuilder.from('test member').build(),
          NewTeamMemberBuilder.from('with email').withEmail('email').build()
        ]
      };
    });

    it('should register, create user and send email and map to Register Success action', () => {
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();
      actions$ = cold('--a--a', { a: registerActions.registerRequested({ credentials, invitationId: '123' }) });

      apiRequestsFacade.startRequest.and.returnValue(null);
      authService.register.and.returnValue(cold('a', { a: firebaseUser }));
      userService.createUser.and.returnValue(cold('a', { a: null }));
      emailConfirmationService.send.and.returnValue(cold('a', { a: null }));

      const expected = cold('--a--a', { a: registerActions.registerSuccess() });

      expect(effects.registerRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.register);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.register, 2, credentials);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 2, firebaseUser, '123');
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(emailConfirmationService.send, 2, firebaseUser);
    });

    it('should fail the request if auth service fails', () => {
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();
      actions$ = cold('--a--a', { a: registerActions.registerRequested({ credentials, invitationId: null }) });

      apiRequestsFacade.startRequest.and.returnValue(null);
      authService.register.and.returnValue(cold('#', null, { code: 'auth/user-exists' }));

      const expectedError: Error = {
        code: 'auth/user-exists',
        id: apiRequestIds.register,
        errorObj: { code: 'auth/user-exists' }
      };
      const expected = cold('--a--a', { a: registerActions.registerFailure({ error: expectedError }) });

      expect(effects.registerRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.register);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.register, 2, credentials);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 0, firebaseUser, null);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(emailConfirmationService.send, 0, firebaseUser);
    });

    it('should fail the request if user service fails', () => {
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();
      actions$ = cold('--a--a', { a: registerActions.registerRequested({ credentials, invitationId: undefined }) });

      apiRequestsFacade.startRequest.and.returnValue(null);
      authService.register.and.returnValue(cold('a', { a: firebaseUser }));
      userService.createUser.and.returnValue(cold('#', null, { code: '500' }));

      const expectedError: Error = {
        code: '500',
        id: apiRequestIds.register,
        errorObj: { code: '500' }
      };
      const expected = cold('--a--a', { a: registerActions.registerFailure({ error: expectedError }) });

      expect(effects.registerRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.register);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.register, 2, credentials);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 2, firebaseUser, undefined);
    });

    it('should fail the request if email confirmation fails', () => {
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();
      actions$ = cold('--a--a', { a: registerActions.registerRequested({ credentials, invitationId: null }) });

      apiRequestsFacade.startRequest.and.returnValue(null);
      authService.register.and.returnValue(cold('a', { a: firebaseUser }));
      userService.createUser.and.returnValue(cold('a', { a: null }));
      emailConfirmationService.send.and.returnValue(cold('#', null, { code: '500' }));

      const expectedError: Error = {
        code: '500',
        id: apiRequestIds.register,
        errorObj: { code: '500' }
      };
      const expected = cold('--a--a', { a: registerActions.registerFailure({ error: expectedError }) });

      expect(effects.registerRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.register);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.register, 2, credentials);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 2, firebaseUser, null);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(emailConfirmationService.send, 2, firebaseUser);
    });
  });

  describe('Register Success', () => {
    it('should navigate to Verify Email page and map to Api Request Success action', () => {
      actions$ = cold('--a', { a: registerActions.registerSuccess() });

      expect(effects.registerSuccess$).toBeObservable(
        cold('--a', { a: apiRequestActions.requestSuccess({ id: apiRequestIds.register }) })
      );
      expect(navigationService.toVerifyEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('Register Failure', () => {
    it('should create failure effects using service', () => {
      errorEffectService.createFrom.calls.reset();
      errorEffectService.createFrom.and.returnValue(of(null));
      const actions = new Actions(of(createAction('test')));

      expect(
        new RegisterEffects(
          actions,
          authService,
          userService,
          emailConfirmationService,
          apiRequestsFacade,
          navigationService,
          errorEffectService
        )
      ).toBeInstanceOf(RegisterEffects);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        errorEffectService.createFrom,
        1,
        actions,
        registerActions.registerFailure
      );
    });
  });
});
