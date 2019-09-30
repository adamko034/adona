import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { Event } from 'src/app/modules/calendar/model/event.model';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import {
  EventsLoadedAction,
  EventsLoadedErrorAction,
  MonthEventsRequestedAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { CalendarEffects } from 'src/app/modules/calendar/store/effects/calendar.effects';
import * as fromCalendar from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { errors } from 'src/app/shared/constants/errors.constants';
import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { CalendarFacade } from 'src/app/modules/calendar/store/calendar.facade';

describe('Calendar Effects', () => {
  let actions$: Observable<Action>;
  let effects: CalendarEffects;
  let events: Event[];
  let store: MockStore<fromCalendar.CalendarState>;

  const timeService = {
    Extraction: jasmine.createSpyObj<TimeExtractionService>('TimeExtractionService', [
      'getYearMonthString'
    ])
  };
  const calendarService = jasmine.createSpyObj<CalendarService>('CalendarService', [
    'getMonthEvents'
  ]);
  const calendarFacade = jasmine.createSpyObj<CalendarFacade>('CalendarFacade', ['monthsLoaded$']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalendarEffects,
        { provide: CalendarService, useValue: calendarService },
        { provide: TimeService, useValue: timeService },
        { provide: CalendarFacade, useValue: calendarFacade },
        provideMockActions(() => actions$),
        provideMockStore()
      ]
    });

    calendarService.getMonthEvents.calls.reset();
    timeService.Extraction.getYearMonthString.calls.reset();

    store = TestBed.get<Store<fromCalendar.CalendarState>>(Store);
    effects = TestBed.get<CalendarEffects>(CalendarEffects);
    events = new EventsTestDataBuilder()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .build();
  });

  describe('Month Events Requested effect', () => {
    it('should load events if not fetched earlier for this month and return Events Loaded action', () => {
      // given
      calendarService.getMonthEvents.and.callFake(() => of(events));
      timeService.Extraction.getYearMonthString.and.returnValue('201901');

      const action = new MonthEventsRequestedAction({ date: new Date() });
      const completion = new EventsLoadedAction({ events, yearMonth: '201901' });
      actions$ = hot('--a|', { a: action });
      const expected = cold('--b|', { b: completion });

      // when && then
      expect(effects.monthEventsRequested$).toBeObservable(expected);
      expect(calendarService.getMonthEvents).toHaveBeenCalledTimes(1);
      expect(timeService.Extraction.getYearMonthString).toHaveBeenCalledTimes(1);
    });

    fit('should not load events for month if they were fetched before', () => {
      // given
      spyOnProperty(calendarFacade, 'monthsLoaded$', 'get').and.returnValue(of(['201901']));
      timeService.Extraction.getYearMonthString.and.returnValue('201901');

      const action = new MonthEventsRequestedAction({ date: new Date() });
      actions$ = hot('-a', { a: action });
      const expected = cold('--|');

      // when & then
      expect(effects.monthEventsRequested$).toBeObservable(expected);
      expect(calendarService.getMonthEvents).not.toHaveBeenCalled();
    });

    it('should return Events Loaded Error action when api call fail', () => {
      // given
      const errorObj = new Error();

      const action = new MonthEventsRequestedAction({ date: new Date() });
      const errored = new EventsLoadedErrorAction({ error: { errorObj } });

      calendarService.getMonthEvents.and.returnValue(throwError(errorObj));

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: errored });

      // when & then
      expect(effects.monthEventsRequested$).toBeObservable(expected);
      expect(calendarService.getMonthEvents).toHaveBeenCalledTimes(1);
    });
  });

  describe('Events Loaded Error effect', () => {
    it('should map to Error Occured action with custom message', () => {
      // given
      const message = 'this is error';
      const action = new EventsLoadedErrorAction({ error: { message, errorObj: { code: '500' } } });
      const completion = new ErrorOccuredAction({ error: { message, errorObj: { code: '500' } } });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      // when & then
      expect(effects.eventsLoadedError$).toBeObservable(expected);
    });

    it('should map to Error Occured action with default message', () => {
      // given
      const action = new EventsLoadedErrorAction({ error: { errorObj: { code: '404' } } });
      const completion = new ErrorOccuredAction({
        error: { errorObj: { code: '404' }, message: errors.DEFAULT_API_GET_ERROR_MESSAGE }
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      // when & then
      expect(effects.eventsLoadedError$).toBeObservable(expected);
    });
  });
});
