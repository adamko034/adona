import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthFacade } from 'src/app/core/auth/auth.facade';
import { ExpensesService } from 'src/app/modules/expenses/services/expenses.service';
import { ExpensesFacade } from 'src/app/modules/expenses/store/expenses.facade';
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

  public withAuthFacade(): SpiesBuilder {
    this.spies.authFacade = jasmine.createSpyObj<AuthFacade>('authFacade', [
      'authenticate',
      'getUser',
      'isLoggedIn',
      'getLoginFailure',
      'login',
      'logout'
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