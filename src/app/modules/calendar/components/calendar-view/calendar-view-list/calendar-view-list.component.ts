import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UserFacade } from 'src/app/core/user/user.facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
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

  private destroyed$: Subject<void>;

  public eventsGrouped: EventsGroupedByStartDate[] = [];
  public hidePastEvents = true;
  public startDateFormat = DateFormat.LongDayNameDayNumberLongMonthName;
  public monthNameFormat = DateFormat.LongMonthName;

  public previousDateToLoad: Date;
  public nextDateToLoad: Date;

  constructor(
    private calendarFacade: CalendarFacade,
    public timeService: TimeService,
    private unsubscriberSerivce: UnsubscriberService,
    private userFacade: UserFacade
  ) {
    this.destroyed$ = this.unsubscriberSerivce.create();
  }

  public ngOnInit() {
    this.userFacade
      .selectUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ selectedTeamId }) => {
        this.calendarFacade
          .selectMonthsLoaded(selectedTeamId)
          .pipe(
            filter((monthsLoaded: Date[]) => monthsLoaded.length !== 0),
            takeUntil(this.destroyed$)
          )
          .subscribe((monthsLoaded: Date[]) => {
            monthsLoaded = [...monthsLoaded].sort((d1, d2) => +d1 - +d2);

            this.previousDateToLoad = this.timeService.Manipulation.addMonths(-1, monthsLoaded[0]);
            this.nextDateToLoad = this.timeService.Manipulation.addMonths(1, monthsLoaded[monthsLoaded.length - 1]);
          });
      });
  }

  public ngOnChanges() {
    this.calculateEventsGrouped();
  }

  public ngOnDestroy() {
    this.unsubscriberSerivce.complete(this.destroyed$);
  }

  public onLoadNext() {
    this.calendarFacade.changeViewDate(this.nextDateToLoad);
    this.nextDateToLoad = this.timeService.Manipulation.addMonths(1, this.nextDateToLoad);
  }

  public onLoadPrevious() {
    this.hidePastEvents = false;
    this.calendarFacade.changeViewDate(this.previousDateToLoad);
    this.previousDateToLoad = this.timeService.Manipulation.addMonths(-1, this.previousDateToLoad);
  }

  public onHidePastEventsChanged() {
    this.calculateEventsGrouped();
  }

  public onEventClicked(event: CalendarEvent) {
    this.eventClicked.emit(event);
  }

  public shouldShowAllDay(event: CalendarEvent, day: Date): boolean {
    if (event.allDay) {
      return true;
    }

    if (!this.timeService.Comparison.areDatesTheSame(event.start, event.end)) {
      return this.timeService.Extraction.isDateBetweenDates(day, event.start, event.end, false);
    }

    return false;
  }

  public getEventStartHour(event: CalendarEvent, day: Date): string {
    if (!this.timeService.Comparison.areDatesTheSame(event.start, event.end)) {
      if (this.timeService.Comparison.areDatesTheSame(event.end, day)) {
        return '--';
      }
    }

    return this.timeService.Extraction.getTimeString(event.start);
  }

  public getEventEndHour(event: CalendarEvent, day: Date) {
    if (!this.timeService.Comparison.areDatesTheSame(event.start, event.end)) {
      if (this.timeService.Comparison.areDatesTheSame(event.start, day)) {
        return '--';
      }
    }

    return this.timeService.Extraction.getTimeString(event.end);
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
