import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions/functions';
import { MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject } from 'rxjs';
import { ApiRequestsFacade } from 'src/app/core/api-requests/api-requests.facade';
import { FirebaseErrorsService } from 'src/app/core/api-requests/services/firebase-errors/firebase-errors.service';
import { AuthFacade } from 'src/app/core/auth/auth.facade';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ErrorFacade } from 'src/app/core/error/error.facade';
import { GuiFacade } from 'src/app/core/gui/gui.facade';
import { ToastrAdonaService } from 'src/app/core/gui/services/toastr-adona-service/toastr-adona.service';
import { InvitationsFacade } from 'src/app/core/invitations/invitations.facade';
import { InvitationsService } from 'src/app/core/invitations/services/invitations-service/invitations.service';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { RouterLocatorService } from 'src/app/core/router/services/router-locator/router-locator.service';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { TeamFactory } from 'src/app/core/team/services/factory/team.factory';
import { TeamService } from 'src/app/core/team/services/team.service';
import { TeamsFacade } from 'src/app/core/team/teams.facade';
import { UserFactory } from 'src/app/core/user/factories/user/user.factory';
import { UserUtilservice } from 'src/app/core/user/services/user-utils.service';
import { UserService } from 'src/app/core/user/services/user.service';
import { UserFacade } from 'src/app/core/user/user.facade';
import { RegisterFacade } from 'src/app/modules/auth/facades/register-facade';
import { EmailConfirmationService } from 'src/app/modules/auth/services/email-confirmation.service';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import { CalendarFacade } from 'src/app/modules/calendar/store/calendar.facade';
import { ExpensesService } from 'src/app/modules/expenses/services/expenses.service';
import { ExpensesFacade } from 'src/app/modules/expenses/store/expenses.facade';
import { SettingsToolbarFactory } from 'src/app/modules/settings/models/settings-toolbar/settings-toolbar-factory.service';
import { ResourceService } from 'src/app/shared/resources/services/resource.service';
import { DialogService } from 'src/app/shared/services/dialogs/dialog.service';
import { SharedDialogsService } from 'src/app/shared/services/dialogs/shared-dialogs.service';
import { EnvironmentService } from 'src/app/shared/services/environment/environment.service';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { DayHoursService } from 'src/app/shared/services/time/parts/day-hours.service';
import { HourQuartersService } from 'src/app/shared/services/time/parts/hour-quarters.service';
import { TimeComparisonService } from 'src/app/shared/services/time/parts/time-comparison.service';
import { TimeCreationService } from 'src/app/shared/services/time/parts/time-creation.service';
import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { TimeManipulationService } from 'src/app/shared/services/time/parts/time-manipulation.service';

export interface Spies {
  navigationService?: jasmine.SpyObj<NavigationService>;
  deviceDetectorService?: jasmine.SpyObj<DeviceDetectorService>;
  expensesFacade?: jasmine.SpyObj<ExpensesFacade>;
  expensesService?: jasmine.SpyObj<ExpensesService>;
  authFacade?: jasmine.SpyObj<AuthFacade>;
  timeService?: jasmine.SpyObj<any>;
  authService?: jasmine.SpyObj<AuthService>;
  userFacade?: jasmine.SpyObj<UserFacade>;
  userService?: jasmine.SpyObj<UserService>;
  teamFacade?: jasmine.SpyObj<TeamsFacade>;
  teamService?: jasmine.SpyObj<TeamService>;
  errorEffectService?: jasmine.SpyObj<ErrorEffectService>;
  angularFirestore?: jasmine.SpyObj<any>;
  calendarFacade?: jasmine.SpyObj<CalendarFacade>;
  dialogService?: jasmine.SpyObj<DialogService>;
  calendarService?: jasmine.SpyObj<CalendarService>;
  errorFacade?: jasmine.SpyObj<ErrorFacade>;
  userUtilsService?: jasmine.SpyObj<UserUtilservice>;
  matDialogRef?: jasmine.SpyObj<MatDialogRef<any>>;
  routerFacade?: jasmine.SpyObj<RouterFacade>;
  guiFacade?: jasmine.SpyObj<GuiFacade>;
  sharedDialogService?: jasmine.SpyObj<SharedDialogsService>;
  registerFacade?: jasmine.SpyObj<RegisterFacade>;
  emailConfirmationService?: jasmine.SpyObj<EmailConfirmationService>;
  unsubscriberService?: jasmine.SpyObj<UnsubscriberService>;
  apiRequestsFacade?: jasmine.SpyObj<ApiRequestsFacade>;
  firebaseErrorsService?: jasmine.SpyObj<FirebaseErrorsService>;
  environmentService?: jasmine.SpyObj<EnvironmentService>;
  invitationsService?: jasmine.SpyObj<InvitationsService>;
  invitationsFacade?: jasmine.SpyObj<InvitationsFacade>;
  toastrAdonaService?: jasmine.SpyObj<ToastrAdonaService>;
  resourceService?: jasmine.SpyObj<ResourceService>;
  settingsToolbarFactory?: jasmine.SpyObj<SettingsToolbarFactory>;
  teamFactory?: jasmine.SpyObj<TeamFactory>;
  userFactory?: jasmine.SpyObj<UserFactory>;
  angularFireFunctions?: jasmine.SpyObj<AngularFireFunctions>;
  routerLocatorService?: jasmine.SpyObj<RouterLocatorService>;
}

export class SpiesBuilder {
  private spies: Spies;
  private constructor() {
    this.spies = {};
  }

  public static init(): SpiesBuilder {
    return new SpiesBuilder();
  }

  public withNavigationService(): SpiesBuilder {
    this.spies.navigationService = jasmine.createSpyObj<NavigationService>('navigationService', [
      'toLogin',
      'toHome',
      'toExpensesMobile',
      'toExpensesDesktop',
      'toExpenseContent',
      'toVerifyEmail',
      'toResetPassword',
      'toEmailVerified',
      'toCalendarDayView',
      'toCalendarWeekView',
      'toCalendarMonthView',
      'toCalendarListView',
      'toSettingsTeamsList'
    ]);

    return this;
  }

  public withDeviceDetectorService(): SpiesBuilder {
    this.spies.deviceDetectorService = jasmine.createSpyObj<DeviceDetectorService>('deviceDetectorService', [
      'isMobile',
      'isDesktop'
    ]);

    return this;
  }

  public withExpensesFacade(): SpiesBuilder {
    this.spies.expensesFacade = jasmine.createSpyObj<ExpensesFacade>('expensesFacade', [
      'loadExpenses',
      'getExpensesLoaded',
      'getExpenses',
      'getExpensesGroupFromRouteParams'
    ]);

    return this;
  }

  public withExpensesService(): SpiesBuilder {
    this.spies.expensesService = jasmine.createSpyObj<ExpensesService>('expensesService', ['getExpenses']);

    return this;
  }

  public withAuthService(): SpiesBuilder {
    this.spies.authService = jasmine.createSpyObj<AuthService>('authService', [
      'getAuthState',
      'login',
      'logout',
      'register',
      'sendPasswordResetEmail',
      'confirmPasswordReset',
      'confirmEmail'
    ]);

    return this;
  }

  public withUserFacade(): SpiesBuilder {
    this.spies.userFacade = jasmine.createSpyObj<UserFacade>('userFacade', [
      'loadUser',
      'selectUser',
      'selectUserId',
      'changeTeam',
      'updateName',
      'handleInvitation',
      'updateTeamName',
      'selectUserTeams',
      'deleteTeam'
    ]);
    return this;
  }

  public withAuthFacade(): SpiesBuilder {
    this.spies.authFacade = jasmine.createSpyObj<AuthFacade>('authFacade', ['selectLoginFailure', 'login', 'logout']);

    return this;
  }

  public withTeamFacade(): SpiesBuilder {
    this.spies.teamFacade = jasmine.createSpyObj<TeamsFacade>('teamFacade', [
      'loadTeams',
      'selectTeams',
      'changeTeamName',
      'loadTeam',
      'addTeam',
      'selectTeam',
      'selectSelectedTeam',
      'deleteTeam',
      'loadSelectedTeam'
    ]);

    return this;
  }

  public withTeamService(): SpiesBuilder {
    this.spies.teamService = jasmine.createSpyObj<TeamService>('teamService', [
      'addTeam',
      'getTeam',
      'getAll',
      'updateName',
      'delete'
    ]);

    return this;
  }

  public withTimeService(): SpiesBuilder {
    const dayHoursMethods = this.getMethodsOf(new DayHoursService());
    const hourQuartersMethods = this.getMethodsOf(new HourQuartersService());
    const extractionMethods = this.getMethodsOf(new TimeExtractionService());
    const manipulationMethods = this.getMethodsOf(new TimeManipulationService());
    const comparisonMethods = this.getMethodsOf(new TimeComparisonService());
    const creationMethdos = this.getMethodsOf(new TimeCreationService());

    this.spies.timeService = {
      DayHours: jasmine.createSpyObj('dayHoursService', dayHoursMethods),
      HourQuarters: jasmine.createSpyObj('hourQuartersService', hourQuartersMethods),
      Extraction: jasmine.createSpyObj('extractionService', extractionMethods),
      Manipulation: jasmine.createSpyObj('manipulationService', manipulationMethods),
      Comparison: jasmine.createSpyObj('comparisonService', comparisonMethods),
      Creation: jasmine.createSpyObj('creationService', creationMethdos)
    };

    return this;
  }

  public withUserService(): SpiesBuilder {
    this.spies.userService = jasmine.createSpyObj<UserService>('userService', [
      'loadUser',
      'changeTeam',
      'createUser',
      'updateName',
      'handleInvitation'
    ]);

    return this;
  }

  public withErrorEffectService(): SpiesBuilder {
    this.spies.errorEffectService = jasmine.createSpyObj<ErrorEffectService>('errorEffectService', ['createFrom']);

    return this;
  }

  public withAngularFirestore(): SpiesBuilder {
    this.spies.angularFirestore = {
      createId: jasmine.createSpy(),
      collection: jasmine.createSpy('collection').and.returnValue({
        doc: jasmine
          .createSpy('doc')
          .and.returnValue(jasmine.createSpyObj('doc', ['valueChanges', 'update', 'set', 'delete']))
      }),
      firestore: {
        batch: jasmine.createSpy('batch').and.returnValue(
          jasmine.createSpyObj<firebase.firestore.WriteBatch>('batch', ['set', 'update', 'delete', 'commit'])
        ),
        collection: jasmine.createSpy('collection').and.returnValue(
          jasmine.createSpyObj<AngularFirestoreCollection>('firestoreCollection', ['add', 'doc', 'valueChanges'])
        ),
        FieldValue: jasmine.createSpyObj<any>('fieldValue', ['arrayUnion'])
      }
    };

    return this;
  }

  public withCalendarFacade(): SpiesBuilder {
    this.spies.calendarFacade = jasmine.createSpyObj<CalendarFacade>('calendarFacade', [
      'selectEvents',
      'selectView',
      'selectViewDate',
      'selectMonthsLoaded',
      'addEvent',
      'updateEvent',
      'loadMonthEvents',
      'deleteEvent',
      'changeViewDate',
      'changeView'
    ]);

    return this;
  }

  public withDialogService(): SpiesBuilder {
    this.spies.dialogService = jasmine.createSpyObj<DialogService>('dialogService', ['open']);
    return this;
  }

  public withCalendarService(): SpiesBuilder {
    this.spies.calendarService = jasmine.createSpyObj<CalendarService>('calendarService', [
      'addEvent',
      'updateEvent',
      'deleteEvent',
      'getMonthEvents'
    ]);

    return this;
  }

  public withErrorFacade(): SpiesBuilder {
    this.spies.errorFacade = jasmine.createSpyObj<ErrorFacade>('errorFacade', ['selectError', 'clearError']);

    return this;
  }

  public withUserUtilsService(): SpiesBuilder {
    this.spies.userUtilsService = jasmine.createSpyObj<UserUtilservice>('userUtilsService', [
      'hasMultipleTeams',
      'extractUsernameFromEmail'
    ]);
    return this;
  }

  public withMatDialogRef(): SpiesBuilder {
    this.spies.matDialogRef = jasmine.createSpyObj('matDialogRef', ['close']);

    return this;
  }

  public withGuiFacade(): SpiesBuilder {
    this.spies.guiFacade = jasmine.createSpyObj<GuiFacade>('guiFacade', [
      'selectSideNavbarOptions',
      'initSideNavbar',
      'toggleSideNavbar',
      'toggleSideNavbarIfMobile',
      'hideLoading',
      'showLoading',
      'selectLoading',
      'clearToastr',
      'showToastr'
    ]);

    return this;
  }

  public withRouterFacade(): SpiesBuilder {
    this.spies.routerFacade = jasmine.createSpyObj('routerFacade', [
      'getRouteParams',
      'selectCurrentRoute',
      'selectAdonaRoutes',
      'selectSettingsRoutes',
      'selectRouteQueryParams',
      'selectRouteData',
      'selectRouteParams',
      'selectCurrentRouteWithParams',
      'navigateAfterTeamDeleted'
    ]);

    return this;
  }

  public withSharedDialogService(): SpiesBuilder {
    this.spies.sharedDialogService = jasmine.createSpyObj<SharedDialogsService>('sharedDialogService', ['changeTeam']);

    return this;
  }

  public withRegisterFacade(): SpiesBuilder {
    this.spies.registerFacade = jasmine.createSpyObj<RegisterFacade>('registerFacade', [
      'register',
      'confirmEmailVerification',
      'sendEmailVerificationLink',
      'confirmPasswordReset',
      'sendPasswordResetEmail'
    ]);

    return this;
  }

  public withEmailConfirmationService(): SpiesBuilder {
    this.spies.emailConfirmationService = jasmine.createSpyObj<EmailConfirmationService>('emailConfirmationService', [
      'send',
      'sendUsingAuthorizedUser'
    ]);
    return this;
  }

  public withUnsubscriberService(): SpiesBuilder {
    this.spies.unsubscriberService = jasmine.createSpyObj<UnsubscriberService>('unsubscriberService', [
      'create',
      'complete'
    ]);

    this.spies.unsubscriberService.create.and.returnValue(new Subject<void>());
    return this;
  }

  public withApiRequestsFacade(): SpiesBuilder {
    this.spies.apiRequestsFacade = jasmine.createSpyObj<ApiRequestsFacade>('apiRequestsFacade', [
      'startRequest',
      'selectApiRequest',
      'successRequest'
    ]);

    return this;
  }

  public withEnvironmentService(): SpiesBuilder {
    this.spies.environmentService = jasmine.createSpyObj<EnvironmentService>('environmentService', ['isProd', 'isDev']);

    return this;
  }

  public withFirebaseErrorsService(): SpiesBuilder {
    this.spies.firebaseErrorsService = jasmine.createSpyObj<FirebaseErrorsService>('firebaseErrorsService', [
      'isErrorHandled'
    ]);
    return this;
  }

  public withInvitationsService(): SpiesBuilder {
    this.spies.invitationsService = jasmine.createSpyObj<InvitationsService>('invitationsService', [
      'addInvitation',
      'get'
    ]);
    return this;
  }

  public withInvitationsFacade(): SpiesBuilder {
    this.spies.invitationsFacade = jasmine.createSpyObj<InvitationsFacade>('invitationsFacade', ['send']);
    return this;
  }

  public withToastrAdonaService(): SpiesBuilder {
    this.spies.toastrAdonaService = jasmine.createSpyObj<ToastrAdonaService>('toastrAdonaService', [
      'show',
      'clearAll'
    ]);
    return this;
  }

  public withResourceService(): SpiesBuilder {
    this.spies.resourceService = jasmine.createSpyObj<ResourceService>('resourceService', ['format']);
    return this;
  }

  public withSettingsToolbarFactory(): SpiesBuilder {
    this.spies.settingsToolbarFactory = jasmine.createSpyObj<SettingsToolbarFactory>('settingsToolbarFactory', [
      'create',
      'createWithSubtitle'
    ]);
    return this;
  }

  public withTeamFactory(): SpiesBuilder {
    this.spies.teamFactory = jasmine.createSpyObj<TeamFactory>('teamFactory', [
      'personalTeamDto',
      'singleFromFirebase',
      'listFromFirebase'
    ]);
    return this;
  }

  public withUserFactory(): SpiesBuilder {
    this.spies.userFactory = jasmine.createSpyObj<UserFactory>('userFactory', [
      'dtofromFirebaseAuth',
      'fromFirebaseUser'
    ]);
    return this;
  }

  public withAngularFireFunctions(): SpiesBuilder {
    this.spies.angularFireFunctions = jasmine.createSpyObj<AngularFireFunctions>('angularFireFunctions', [
      'httpsCallable'
    ]);
    return this;
  }

  public withRouterLocatorService(): SpiesBuilder {
    this.spies.routerLocatorService = jasmine.createSpyObj<RouterLocatorService>('routerLocatorService', [
      'isTeamDetailsPage'
    ]);
    return this;
  }

  private getMethodsOf(obj): string[] {
    const methods: string[] = [];

    const obj2 = Reflect.getPrototypeOf(obj);
    Reflect.ownKeys(obj2).forEach((k) => {
      if (k.toString() !== 'constructor') {
        methods.push(k.toString());
      }
    });

    return methods;
  }

  public build(): Spies {
    return this.spies;
  }
}
