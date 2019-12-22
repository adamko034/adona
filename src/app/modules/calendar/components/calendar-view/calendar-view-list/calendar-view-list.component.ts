import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { EventsGroupedByStartDate } from './model/events-grouped-by-start-date.model';
import { TimeService } from '../../../../../shared/services/time/time.service';
import { DateFormat } from '../../../../../shared/services/time/model/date-format.enum';
import { Event } from '../../../model/event.model';
import { CalendarFacade } from '../../../store/calendar.facade';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CalendarConstants } from '../../../utils/calendar-constants';

@Component({
  selector: 'app-calendar-view-list',
  templateUrl: './calendar-view-list.component.html',
  styleUrls: ['./calendar-view-list.component.scss']
})
export class CalendarViewListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() events: CalendarEvent[];

  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  private monthsLoadedSubscription: Subscription;

  eventsGrouped: EventsGroupedByStartDate[] = [];
  hidePastEvents = true;
  startDateFormat = DateFormat.LongDayNameDayNumberLongMonthName;
  monthNameFormat = DateFormat.LongMonthName;

  previousDateToLoad: Date;
  nextDateToLoad: Date;

  constructor(private calendarFacade: CalendarFacade, public timeService: TimeService) {}

  public ngOnInit() {
    if (!this.previousDateToLoad) {
      this.previousDateToLoad = this.timeService.Manipulation.addMonths(-2, new Date());
    }

    if (!this.nextDateToLoad) {
      this.nextDateToLoad = this.timeService.Manipulation.addMonths(2, new Date());
    }

    this.monthsLoadedSubscription = this.calendarFacade
      .getMonthsLoaded()
      .pipe(
        filter((monthsLoaded: string[]) => monthsLoaded.length === 0),
        map((monthsLoaded: string[]) => {
          monthsLoaded.sort();
          const minMonth = this.timeService.Creation.getDateTimeFromMonthLoaded(monthsLoaded[0]);
          const maxMonth = this.timeService.Creation.getDateTimeFromMonthLoaded(monthsLoaded[monthsLoaded.length - 1]);

          this.previousDateToLoad = this.timeService.Manipulation.addMonths(-1, minMonth);
          this.nextDateToLoad = this.timeService.Manipulation.addMonths(1, maxMonth);
        })
      )
      .subscribe();
  }

  public ngOnChanges() {
    console.log('on changes');
    this.calculateEventsGrouped();
  }

  public ngOnDestroy() {
    if (this.monthsLoadedSubscription) {
      this.monthsLoadedSubscription.unsubscribe();
    }
  }

  public onLoadNext() {
    this.calendarFacade.loadMonthEvents(this.nextDateToLoad);
    this.nextDateToLoad = this.timeService.Manipulation.addMonths(1, this.nextDateToLoad);
  }

  public onLoadPrevious() {
    this.hidePastEvents = false;
    this.calendarFacade.loadMonthEvents(this.previousDateToLoad);
    this.previousDateToLoad = this.timeService.Manipulation.addMonths(-1, this.previousDateToLoad);
  }

  public onHidePastEventsChanged() {
    this.calculateEventsGrouped();
  }

  public onEventClicked(event: CalendarEvent) {
    this.eventClicked.emit(event);
  }

  private calculateEventsGrouped() {
    this.eventsGrouped = [];
    let eventsToGroup = [...this.events];

    this.createGroups(eventsToGroup);
    this.appendTodayGroupIfNotExists();

    this.eventsGrouped.sort((g1, g2) => +g1.start - +g2.start);

    this.filterPastEventsIfNeeded();
    this.appendIds();
  }

  private filterPastEventsIfNeeded() {
    if (this.hidePastEvents) {
      const now = new Date();
      this.eventsGrouped = this.eventsGrouped.filter(
        (group: EventsGroupedByStartDate) => !this.timeService.Comparison.isDateBefore(group.start, now)
      );
    }
  }

  private createGroups(eventsToGroup: CalendarEvent[]) {
    eventsToGroup.forEach((event) => {
      let date = event.start;
      const end = event.end;

      do {
        let group = this.eventsGrouped.find((x) => this.timeService.Comparison.areDatesTheSame(x.start, date));

        if (!group) {
          group = this.createEmptyGroup(date);
          this.eventsGrouped.push(group);
        }

        group.events.push(event);

        date = this.timeService.Manipulation.addDays(1, date);
      } while (this.timeService.Comparison.isDateBeforeOrEqualThan(date, end));
    });
  }

  private createEmptyGroup(startDate: Date): EventsGroupedByStartDate {
    return {
      id: '',
      start: startDate,
      events: []
    };
  }

  private appendTodayGroupIfNotExists() {
    const now = new Date();
    if (this.eventsGrouped.findIndex((group) => this.timeService.Comparison.areDatesTheSame(group.start, now)) < 0) {
      this.eventsGrouped.push({ id: '', start: now, events: [] });
    }
  }

  private appendIds() {
    this.eventsGrouped.find((x) => this.timeService.Comparison.areDatesTheSame(x.start, new Date())).id =
      CalendarConstants.EventContainerTodayId;
  }
}
