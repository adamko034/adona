import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { DefaultErrorType } from 'src/app/core/error/enum/default-error-type.enum';
import { ErrorBuilder } from 'src/app/core/error/model/error.builder';
import { calendarActions } from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarEventsEffects } from 'src/app/modules/calendar/store/effects/events/calendar-events.effects';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { DateTestBuilder } from 'src/app/utils/testUtils/builders/date-test.builder';
import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';

describe('Calendar Events Effects', () => {
  let effects: CalendarEventsEffects;
  let actions$: Actions;

  const teamId = '123';
  const dateNow = DateTestBuilder.now().build();
  const events = EventsTestDataBuilder.from()
    .addOneWithDefaultData()
    .addOneWithDefaultData()
    .addOneWithDefaultData()
    .buildEvents();

  const {
    calendarService,
    timeService,
    calendarFacade,
    errorEffectService
  } = SpiesBuilder.init().withCalendarService().withTimeService().withCalendarFacade().withErrorEffectService().build();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$)]
    });

    actions$ = TestBed.inject(Actions);
    effects = new CalendarEventsEffects(actions$, errorEffectService, calendarService, calendarFacade, timeService);

    calendarFacade.selectMonthsLoaded.calls.reset();
    calendarService.getMonthEvents.calls.reset();
    timeService.Comparison.areDatesInTheSameMonth.calls.reset();

    timeService.Comparison.areDatesInTheSameMonth.and.callFake(isMonthTheSame);
  });

  it('should create Load Month Events Failure effect', () => {
    errorEffectService.createFrom.calls.reset();

    effects = new CalendarEventsEffects(actions$, errorEffectService, calendarService, calendarFacade, timeService);

    JasmineCustomMatchers.toHaveBeenCalledTimesWith(
      errorEffectService.createFrom,
      1,
      actions$,
      calendarActions.events.loadMonthEventsFailure,
      DefaultErrorType.ApiGet
    );
  });

  describe('Load Month Events Request effect', () => {
    it('should load events if not fetched earlier and map to Load Month Events Success action', () => {
      calendarFacade.selectMonthsLoaded.and.returnValue(
        of([
          DateTestBuilder.now().addMonth(-1).build(),
          DateTestBuilder.now().addMonth(-2).build(),
          DateTestBuilder.now().addMonth(-12).build()
        ])
      );
      calendarService.getMonthEvents.and.returnValue(of(events));
      const action = calendarActions.events.loadMonthEventsRequest({ date: dateNow, teamId });
      const completion = calendarActions.events.loadMonthEventsSuccess({ events, date: dateNow, teamId });

      actions$ = hot('--a--a', { a: action });
      const expected = cold('--b--b', { b: completion });

      // when && then
      expect(effects.monthEventsRequest$).toBeObservable(expected);
      expect(calendarFacade.selectMonthsLoaded).toHaveBeenCalledTimes(2);
      expect(calendarFacade.selectMonthsLoaded).toHaveBeenCalledWith(teamId);
      expect(calendarService.getMonthEvents).toHaveBeenCalledTimes(2);
      expect(timeService.Comparison.areDatesInTheSameMonth).toHaveBeenCalledTimes(6);
    });

    it('should not load events for month if they were fetched before', () => {
      calendarFacade.selectMonthsLoaded.and.returnValue(
        of([
          DateTestBuilder.now().addMonth(-1).build(),
          DateTestBuilder.now().build(),
          DateTestBuilder.now().addMonth(-2).build()
        ])
      );
      const action = calendarActions.events.loadMonthEventsRequest({ date: dateNow, teamId });

      actions$ = hot('--a--a', { a: action });

      expect(effects.monthEventsRequest$).toBeObservable(cold('------'));
      expect(calendarFacade.selectMonthsLoaded).toHaveBeenCalledTimes(2);
      expect(calendarFacade.selectMonthsLoaded).toHaveBeenCalledWith(teamId);
      expect(calendarService.getMonthEvents).toHaveBeenCalledTimes(0);
      expect(timeService.Comparison.areDatesInTheSameMonth).toHaveBeenCalled();
    });

    it('should return Events Loaded Error action when api call fail', () => {
      calendarFacade.selectMonthsLoaded.and.returnValue(
        of([DateTestBuilder.now().addMonth(-1).build(), DateTestBuilder.now().addMonth(-2).build()])
      );
      calendarService.getMonthEvents.and.returnValue(cold('#', null, { test: 500 }));
      const action = calendarActions.events.loadMonthEventsRequest({ date: dateNow, teamId });
      const completion = calendarActions.events.loadMonthEventsFailure({
        error: ErrorBuilder.from().withErrorObject({ test: 500 }).build()
      });

      actions$ = hot('--a--a', { a: action });
      const expected = cold('--b--b', { b: completion });

      expect(effects.monthEventsRequest$).toBeObservable(expected);
      expect(calendarFacade.selectMonthsLoaded).toHaveBeenCalledTimes(2);
      expect(calendarFacade.selectMonthsLoaded).toHaveBeenCalledWith(teamId);
      expect(calendarService.getMonthEvents).toHaveBeenCalledTimes(2);
    });
  });
});

function isMonthTheSame(date1: Date, date2: Date) {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}
