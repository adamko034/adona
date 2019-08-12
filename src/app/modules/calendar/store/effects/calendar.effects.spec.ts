import { TestBed } from '@angular/core/testing';
import { CalendarEffects } from 'src/app/modules/calendar/store/effects/calendar.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, from } from 'rxjs';
import { Action, Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  AllEventsRequestedAction,
  AllEventsLoadedAction
} from 'src/app/modules/calendar/store/actions/calendar.actions';
import { EventsTestDataBuilder } from 'src/app/modules/calendar/utils/tests/event-test-data.builder';
import { hot, cold } from 'jasmine-marbles';
import { CalendarService } from 'src/app/modules/calendar/service/calendar.service';
import { Event } from 'src/app/modules/calendar/model/event.model';
import * as fromCalendar from 'src/app/modules/calendar/store/reducers/calendar.reducer';
import { calendarQueries } from 'src/app/modules/calendar/store/selectors/calendar.selectors';

describe('Calendar Effects', () => {
  let actions$: Observable<Action>;
  let effects: CalendarEffects;
  let events: Event[];
  let store: MockStore<fromCalendar.CalendarState>;
  let selectEventsLoadedMock: MemoizedSelector<fromCalendar.CalendarState, boolean>;

  const service = jasmine.createSpyObj('CalendarService', ['getEvents']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalendarEffects,
        { provide: CalendarService, useValue: service },
        provideMockActions(() => actions$),
        provideMockStore()
      ]
    });

    service.getEvents.calls.reset();
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
      service.getEvents.and.callFake(() => of(events));

      const action = new AllEventsRequestedAction();
      const completion = new AllEventsLoadedAction({ events });
      actions$ = hot('--a|', { a: action });
      const expected = cold('--b|', { b: completion });

      // when && then
      expect(effects.allEventsReqeusted$).toBeObservable(expected);
      expect(service.getEvents).toHaveBeenCalledTimes(1);
    });

    it('should not load events if they were fetched before', () => {
      // given
      store.overrideSelector(calendarQueries.selectAllEventsLoaded, true);

      const action = new AllEventsRequestedAction();
      actions$ = hot('--a|', { a: action });
      const expected = cold('---|');

      // when & then
      expect(effects.allEventsReqeusted$).toBeObservable(expected);
      expect(service.getEvents).not.toHaveBeenCalled();
    });
  });
});
