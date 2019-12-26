import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DateFormat } from '../../../../../shared/services/time/model/date-format.enum';
import { TimeService } from '../../../../../shared/services/time/time.service';
import { CalendarFacade } from '../../../store/calendar.facade';
import { CalendarConstants } from '../../../utils/calendar-constants';
import { EventsGroupedByStartDate } from './model/events-grouped-by-start-date.model';

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
    this.monthsLoadedSubscription = this.calendarFacade
      .getMonthsLoaded()
      .pipe(filter((monthsLoaded: string[]) => monthsLoaded.length !== 0))
      .subscribe((monthsLoaded: string[]) => {
        monthsLoaded = [...monthsLoaded].sort();
        const minMonth = this.timeService.Creation.getDateTimeFromMonthLoaded(monthsLoaded[0]);
        const maxMonth = this.timeService.Creation.getDateTimeFromMonthLoaded(monthsLoaded[monthsLoaded.length - 1]);

        this.previousDateToLoad = this.timeService.Manipulation.addMonths(-1, minMonth);
        this.nextDateToLoad = this.timeService.Manipulation.addMonths(1, maxMonth);
      });
  }

  public ngOnChanges() {
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
    const eventsToGroup = [...this.events];

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
    eventsToGroup.forEach(event => {
      let date = event.start;
      const end = event.end;

      do {
        let group = this.eventsGrouped.find(x => this.timeService.Comparison.areDatesTheSame(x.start, date));

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
    if (this.eventsGrouped.findIndex(group => this.timeService.Comparison.areDatesTheSame(group.start, now)) < 0) {
      this.eventsGrouped.push({ id: '', start: now, events: [] });
    }
  }

  private appendIds() {
    this.eventsGrouped.find(x => this.timeService.Comparison.areDatesTheSame(x.start, new Date())).id =
      CalendarConstants.EventContainerTodayId;
  }
}
