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
import { DefaultErrorType } from 'src/app/core/error/enum/default-error-type.enum';
import { Error } from 'src/app/core/error/model/error.model';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { apiRequestActions } from 'src/app/core/store/actions/api-requests.actions';
import { TeamMembersBuilder } from 'src/app/core/team/model/builders/team-members.builder';
import { NewTeamRequest } from 'src/app/core/team/model/new-team-request/new-team-request.model';
import { TeamService } from 'src/app/core/team/services/team.service';
import { UserBuilder } from 'src/app/core/user/model/builders/user.builder';
import { User } from 'src/app/core/user/model/user.model';
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
  const user = UserBuilder.from(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName)
    .withPhotoUrl(UserBuilder.defaultPhotoUrl)
    .build();

  const {
    authService,
    emailConfirmationService,
    userService,
    navigationService,
    apiRequestsFacade,
    errorEffectService,
    teamService
  } = SpiesBuilder.init()
    .withAuthService()
    .withEmailConfirmationService()
    .withUserService()
    .withErrorEffectService()
    .withApiRequestsFacade()
    .withNavigationService()
    .withTeamService()
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
        { provide: ErrorEffectService, useValue: errorEffectService },
        { provide: TeamService, useValue: teamService }
      ]
    });

    effects = TestBed.inject<RegisterEffects>(RegisterEffects);

    authService.register.calls.reset();
    userService.createUser.calls.reset();
    emailConfirmationService.send.calls.reset();
    apiRequestsFacade.startRequest.calls.reset();
    teamService.addTeam.calls.reset();
  });

  describe('Register Requested', () => {
    let teamRequest: NewTeamRequest;
    beforeEach(() => {
      teamRequest = {
        created: mockDate,
        createdBy: user.name,
        name: 'Personal',
        members: TeamMembersBuilder.from().withMember(user.name, user.photoUrl).build()
      };
    });

    it('should register, create user with team and with default photo url, send email and map to Register Success action', () => {
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();
      const firebaseUserWithoutPhotoUrl = { ...firebaseUser, photoURL: null };
      actions$ = cold('--a--a', { a: registerActions.registerRequested({ credentials }) });

      apiRequestsFacade.startRequest.and.returnValue(null);
      authService.register.and.returnValue(cold('a', { a: firebaseUserWithoutPhotoUrl }));
      userService.createUser.and.returnValue(cold('a', { a: null }));
      emailConfirmationService.send.and.returnValue(cold('a', { a: null }));
      teamService.addTeam.and.returnValue(cold('a', { a: null }));

      const expected = cold('--a--a', { a: registerActions.registerSuccess() });

      expect(effects.registerRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.register);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.register, 2, credentials);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 2, user);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(emailConfirmationService.send, 2, firebaseUserWithoutPhotoUrl);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        teamService.addTeam,
        2,
        teamRequest,
        firebaseUserWithoutPhotoUrl.uid
      );
    });

    it('should register, create user with team and using firebase photo url, send email and map to Register Success action', () => {
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();
      actions$ = cold('--a--a', { a: registerActions.registerRequested({ credentials }) });

      const firebaseUserWithPhotoUrl: firebase.User = { ...firebaseUser, photoURL: 'testUrls' };
      const userWithPhotoUrl: User = { ...user, photoUrl: 'testUrls' };

      apiRequestsFacade.startRequest.and.returnValue(null);
      authService.register.and.returnValue(cold('a', { a: firebaseUserWithPhotoUrl }));
      userService.createUser.and.returnValue(cold('a', { a: null }));
      emailConfirmationService.send.and.returnValue(cold('a', { a: null }));
      teamService.addTeam.and.returnValue(cold('a', { a: null }));

      const expected = cold('--a--a', { a: registerActions.registerSuccess() });

      expect(effects.registerRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.register);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.register, 2, credentials);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 2, userWithPhotoUrl);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(emailConfirmationService.send, 2, firebaseUserWithPhotoUrl);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        teamService.addTeam,
        2,
        {
          ...teamRequest,
          members: TeamMembersBuilder.from()
            .withMember(firebaseUserWithPhotoUrl.displayName, firebaseUserWithPhotoUrl.photoURL)
            .build()
        },
        firebaseUserWithPhotoUrl.uid
      );
    });

    it('should fail the request if auth service fails', () => {
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();
      actions$ = cold('--a--a', { a: registerActions.registerRequested({ credentials }) });

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
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 0, user);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.addTeam, 0);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(emailConfirmationService.send, 0, firebaseUser);
    });

    it('should fail the request if user service fails', () => {
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();
      actions$ = cold('--a--a', { a: registerActions.registerRequested({ credentials }) });

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
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 2, user);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.addTeam, 0);
    });

    it('should fail the request if teams service fails', () => {
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();
      actions$ = cold('--a--a', { a: registerActions.registerRequested({ credentials }) });

      apiRequestsFacade.startRequest.and.returnValue(null);
      authService.register.and.returnValue(cold('a', { a: firebaseUser }));
      userService.createUser.and.returnValue(cold('a', { a: null }));
      emailConfirmationService.send.and.returnValue(cold('a', { a: null }));
      teamService.addTeam.and.returnValue(cold('#', null, { code: '500' }));

      const expectedError: Error = {
        code: '500',
        id: apiRequestIds.register,
        errorObj: { code: '500' }
      };
      const expected = cold('--a--a', { a: registerActions.registerFailure({ error: expectedError }) });

      expect(effects.registerRequested$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(apiRequestsFacade.startRequest, 2, apiRequestIds.register);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(authService.register, 2, credentials);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 2, user);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(teamService.addTeam, 2, teamRequest, firebaseUser.uid);
      expect(emailConfirmationService.send).not.toHaveBeenCalled();
    });

    it('should fail the request if email confirmation fails', () => {
      const credentials = CredentialsBuilder.from('user@example.com', 'pass1').build();
      actions$ = cold('--a--a', { a: registerActions.registerRequested({ credentials }) });

      apiRequestsFacade.startRequest.and.returnValue(null);
      authService.register.and.returnValue(cold('a', { a: firebaseUser }));
      userService.createUser.and.returnValue(cold('a', { a: null }));
      teamService.addTeam.and.returnValue(cold('a', { a: null }));
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
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(userService.createUser, 2, user);
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
          errorEffectService,
          teamService
        )
      ).toBeInstanceOf(RegisterEffects);

      JasmineCustomMatchers.toHaveBeenCalledTimesWith(
        errorEffectService.createFrom,
        1,
        actions,
        registerActions.registerFailure,
        DefaultErrorType.ApiOther
      );
    });
  });
});
