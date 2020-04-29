import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarUiEffects } from 'src/app/modules/calendar/store/effects/ui/calendar-ui.effects';
import { DateTestBuilder } from 'src/app/utils/testUtils/builders/date-test.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Calendar UI Effects', () => {
  let effects: CalendarUiEffects;
  let actions$: Actions;

  const { calendarFacade } = SpiesBuilder.init().withCalendarFacade().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new CalendarUiEffects(actions$, calendarFacade);
  });

  describe('View Date Change effect', () => {
    it('should invoke Load Month Events Request action', () => {
      const newDate = DateTestBuilder.now().build();

      actions$ = hot('--a--a', { a: calendarActions.ui.viewDateChange({ date: newDate }) });
      const expected = cold('--b--b', { b: calendarActions.ui.viewDateChange({ date: newDate }) });

      expect(effects.viewDateChange$).toBeObservable(expected);
      JasmineCustomMatchers.toHaveBeenCalledTimesWith(calendarFacade.loadMonthEvents, 2, newDate);
    });
  });
});
