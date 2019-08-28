import { TestBed } from '@angular/core/testing';
import { CalendarEffects } from 'src/app/modules/calendar/store/effects/calendar.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, from, throwError, noop } from 'rxjs';
import { Action, Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  AllEventsRequestedAction,
  AllEventsLoadedAction,
  EventsLoadedErrorAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { hot, cold } from 'jasmine-marbles';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import { Event } from 'src/app/modules/calendar/model/event.model';
import * as fromCalendar from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';
import { ErrorOccuredAction } from 'src/app/core/store/actions/error.actions';
import { errors } from 'src/app/shared/constants/errors.constants';

describe('Calendar Effects', () => {
  let actions$: Observable<Action>;
  let effects: CalendarEffects;
  let events: Event[];
  let store: MockStore<fromCalendar.CalendarState>;
  let selectEventsLoadedMock: MemoizedSelector<fromCalendar.CalendarState, boolean>;

  const calendarService = jasmine.createSpyObj('CalendarService', ['getEvents']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalendarEffects,
        { provide: CalendarService, useValue: calendarService },
        provideMockActions(() => actions$),
        provideMockStore()
      ]
    });

    calendarService.getEvents.calls.reset();
    store = TestBed.get<Store<fromCalendar.CalendarState>>(Store);
    effects = TestBed.get<CalendarEffects>(CalendarEffects);
    selectEventsLoadedMock = store.overrideSelector(calendarQueries.selectAllEventsLoaded, false);
    events = new EventsTestDataBuilder()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .addOneWithDefaultData()
      .build();
  });

  describe('All Events Requested effect', () => {
    it('should load events if not fetched earlier and return All Evnets Loaded action', () => {
      // given
      calendarService.getEvents.and.callFake(() => of(events));

      const action = new AllEventsRequestedAction();
      const completion = new AllEventsLoadedAction({ events });
      actions$ = hot('--a|', { a: action });
      const expected = cold('--b|', { b: completion });

      // when && then
      expect(effects.allEventsRequested$).toBeObservable(expected);
      expect(calendarService.getEvents).toHaveBeenCalledTimes(1);
    });

    it('should not load events if they were fetched before', () => {
      // given
      store.overrideSelector(calendarQueries.selectAllEventsLoaded, true);

      const action = new AllEventsRequestedAction();
      actions$ = hot('--a|', { a: action });
      const expected = cold('---|');

      // when & then
      expect(effects.allEventsRequested$).toBeObservable(expected);
      expect(calendarService.getEvents).not.toHaveBeenCalled();
    });

    it('should return Events Loaded Error action when api call fail', () => {
      // given
      const action = new AllEventsRequestedAction();
      const errored = new EventsLoadedErrorAction();

      calendarService.getEvents.and.returnValue(throwError(new Error()));

      actions$ = hot('a|', { a: action });
      const expected = cold('(b|)', { b: errored });

      // when & then
      expect(effects.allEventsRequested$).toBeObservable(expected);
      expect(calendarService.getEvents).toHaveBeenCalledTimes(1);
    });
  });

  describe('Events Loaded Error effect', () => {
    it('should map to Error Occured action with custom message', () => {
      // given
      const error = 'this is error';
      const action = new EventsLoadedErrorAction({ error });
      const completion = new ErrorOccuredAction({ message: error });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      // when & then
      expect(effects.eventsLoadedError$).toBeObservable(expected);
    });

    it('should map to Error Occured action with default message', () => {
      // given
      const action = new EventsLoadedErrorAction();
      const completion = new ErrorOccuredAction({ message: errors.DEFAULT_API_ERROR_MESSAGE });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      // when & then
      expect(effects.eventsLoadedError$).toBeObservable(expected);
    });
  });
});
