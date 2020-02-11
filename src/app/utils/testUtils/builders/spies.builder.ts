import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthFacade } from 'src/app/core/auth/auth.facade';
import { ErrorEffectService } from 'src/app/core/services/store/error-effect.service';
import { UserService } from 'src/app/core/user/services/user.service';
import { ExpensesService } from 'src/app/modules/expenses/services/expenses.service';
import { ExpensesFacade } from 'src/app/modules/expenses/store/expenses.facade';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { DayHoursService } from 'src/app/shared/services/time/parts/day-hours.service';
import { HourQuartersService } from 'src/app/shared/services/time/parts/hour-quarters.service';
import { TimeComparisonService } from 'src/app/shared/services/time/parts/time-comparison.service';
import { TimeCreationService } from 'src/app/shared/services/time/parts/time-creation.service';
import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { TimeManipulationService } from 'src/app/shared/services/time/parts/time-manipulation.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { TeamService } from '../../../core/team/services/team.service';
import { TeamFacade } from '../../../core/team/team.facade';
import { UserFacade } from '../../../core/user/user.facade';

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
  teamFacade?: jasmine.SpyObj<TeamFacade>;
  teamService?: jasmine.SpyObj<TeamService>;
  errorEffectService?: jasmine.SpyObj<ErrorEffectService>;
  angularFirestore?: jasmine.SpyObj<any>;
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
      'toExpenseContent'
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
    this.spies.authService = jasmine.createSpyObj<AuthService>('authService', ['getAuthState', 'login', 'logout']);

    return this;
  }

  public withUserFacade(): SpiesBuilder {
    this.spies.userFacade = jasmine.createSpyObj<UserFacade>('userFacade', ['loadUser', 'selectUser', 'selectUserId']);
    return this;
  }

  public withAuthFacade(): SpiesBuilder {
    this.spies.authFacade = jasmine.createSpyObj<AuthFacade>('authFacade', ['getLoginFailure', 'login', 'logout']);

    return this;
  }

  public withTeamFacade(): SpiesBuilder {
    this.spies.teamFacade = jasmine.createSpyObj<TeamFacade>('teamFacade', [
      'loadSelectedTeam',
      'loadTeam',
      'addTeam',
      'selectTeams',
      'selectSelectedTeam'
    ]);

    return this;
  }

  public withTeamService(): SpiesBuilder {
    this.spies.teamService = jasmine.createSpyObj<TeamService>('teamService', ['addTeam', 'loadTeam']);

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
    this.spies.userService = jasmine.createSpyObj<UserService>('userService', ['loadUser', 'changeTeam']);

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
        doc: jasmine.createSpy('doc').and.returnValue(jasmine.createSpyObj('doc', ['valueChanges']))
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

  private getMethodsOf(obj): string[] {
    const methods: string[] = [];

    const obj2 = Reflect.getPrototypeOf(obj);
    Reflect.ownKeys(obj2).forEach(k => {
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
